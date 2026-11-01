import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// In-memory log buffer for the admin /api/admin/logs endpoint
const logBuffer: Array<{ level: string; message: string; timestamp: string; meta?: Record<string, unknown> }> = [];
const MAX_LOG_BUFFER = 500;

function addToBuffer(level: string, message: string, meta?: Record<string, unknown>): void {
  logBuffer.push({
    level,
    message,
    timestamp: new Date().toISOString(),
    meta,
  });
  if (logBuffer.length > MAX_LOG_BUFFER) {
    logBuffer.shift();
  }
}

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr =
      Object.keys(meta).length && meta.stack == null
        ? ` ${JSON.stringify(meta)}`
        : '';
    return `[${ts}] ${level}: ${message}${metaStr}`;
  })
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

const transports: winston.transport[] = [
  new winston.transports.Console({ format: consoleFormat }),
];

// Production: also write to files
if (config.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    })
  );
}

const winstonLogger = winston.createLogger({
  level: config.logLevel,
  transports,
});

// Proxy logger that also buffers entries
export const logger = {
  error(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.error(message, meta);
    addToBuffer('error', message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, meta);
    addToBuffer('warn', message, meta);
  },
  info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, meta);
    addToBuffer('info', message, meta);
  },
  http(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.http(message, meta);
    addToBuffer('http', message, meta);
  },
  debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, meta);
    addToBuffer('debug', message, meta);
  },
  getLogs(limit = 100) {
    return logBuffer.slice(-limit);
  },
};
