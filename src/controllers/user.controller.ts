import { Request, Response } from 'express';
import { userService } from '../services/user.service';

/**
 * Controller handling user routes.
 */
export class UserController {
  /** Get list of users */
  async list(req: Request, res: Response) {
    const users = await userService.list();
    res.json(users);
  }

  /** Create a user */
  async create(req: Request, res: Response) {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  }

  /** Get user by ID */
  async get(req: Request, res: Response) {
    const user = await userService.getById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  }

  /** Update user by ID */
  async update(req: Request, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  }

  /** Delete user by ID */
  async delete(req: Request, res: Response) {
    await userService.delete(req.params.id);
    res.status(204).end();
  }
}

export const userController = new UserController();
