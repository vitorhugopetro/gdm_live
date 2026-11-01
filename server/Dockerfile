# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Copy production node_modules and compiled dist
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -S gdmradio && adduser -S gdmradio -G gdmradio
USER gdmradio

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/status || exit 1

EXPOSE 3001

CMD ["node", "dist/server.js"]

