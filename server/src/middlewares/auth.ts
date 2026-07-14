import type { NextFunction, Request, Response } from 'express'
import { HttpError } from './error.js'
import { verifyToken, type TokenPayload } from '../services/token.js'

// Augment Express Request with the authenticated user.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'Not authenticated')
  try {
    req.user = verifyToken(header.slice(7))
    next()
  } catch {
    throw new HttpError(401, 'Invalid or expired token')
  }
}

/** Restrict a route to specific roles. Staff can do order/dashboard work; owner does everything. */
export function requireRole(...roles: Array<'owner' | 'staff'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new HttpError(401, 'Not authenticated')
    if (!roles.includes(req.user.role)) throw new HttpError(403, 'Not allowed')
    next()
  }
}
