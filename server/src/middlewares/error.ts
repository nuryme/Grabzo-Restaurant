import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

/** Throw this from services for expected, client-facing failures. */
export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation failed', issues: err.issues })
    return
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message })
    return
  }
  console.error('[error]', err)
  res.status(500).json({ message: 'Something went wrong' })
}
