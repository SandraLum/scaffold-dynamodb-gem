import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service.js';

/**
 * Create user controller.
 */
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * Get user by ID controller.
 */
export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * Update user controller.
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete user controller.
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
