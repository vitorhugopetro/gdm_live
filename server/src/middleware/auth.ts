import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { config } from '../config';
import { logger } from '../config/logger';

// ─── Token Verification ───────────────────────────────────────────────────────

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Missing or invalid Authorization header. Expected: Bearer <token>',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Check admin custom claim
    if (decoded.admin === true) {
      next();
      return;
    }

    // Check admin email list
    const email = decoded.email || '';
    if (config.adminEmails.length > 0 && config.adminEmails.includes(email)) {
      next();
      return;
    }

    // Check if email list is empty (open admin mode for dev)
    if (config.adminEmails.length === 0 && !config.isProduction) {
      logger.warn('Admin email list is empty — allowing all authenticated users in dev mode');
      next();
      return;
    }

    logger.warn(`Unauthorized admin attempt by: ${email} (uid: ${decoded.uid})`);
    res.status(403).json({
      success: false,
      error: 'Forbidden: You do not have admin privileges',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = (err as Error).message || 'Token verification failed';
    logger.warn(`Auth token verification failed: ${message}`);
    res.status(401).json({
      success: false,
      error: `Unauthorized: ${message}`,
      timestamp: new Date().toISOString(),
    });
  }
}

// ─── Optional Auth (attaches user info if token present, but doesn't block) ───

export async function optionalAuth(
  req: Request & { user?: admin.auth.DecodedIdToken },
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
  } catch { /* ignore */ }

  next();
}
