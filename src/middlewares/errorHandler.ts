import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // eslint-disable-line @typescript-eslint/no-unused-vars
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
}
