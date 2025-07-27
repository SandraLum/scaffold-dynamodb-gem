import { userModel } from '../models/user.model';
import { User } from '../types/user.types';
import { randomUUID } from 'crypto';

/**
 * Business logic layer for Users.
 */
export class UserService {
  /**
   * Creates a new user.
   */
  async create(data: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    const user: User = { ...data, userId: randomUUID(), createdAt: now, updatedAt: now };
    return userModel.create(user);
  }

  /**
   * Returns a user by ID.
   */
  async getById(userId: string): Promise<User | null> {
    return userModel.findById(userId);
  }

  /**
   * Updates a user.
   */
  async update(userId: string, updates: Partial<User>): Promise<User | null> {
    updates.updatedAt = new Date().toISOString();
    return userModel.update(userId, updates);
  }

  /**
   * Deletes a user by ID.
   */
  async delete(userId: string): Promise<void> {
    await userModel.delete(userId);
  }

  /**
   * Returns all users.
   */
  async list(): Promise<User[]> {
    return userModel.list();
  }
}

export const userService = new UserService();
