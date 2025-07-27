import * as UserModel from '../models/user.model.js';
import { randomUUID } from 'crypto';
import { User } from '../models/user.model.js';

/**
 * Create a new user with generated ID.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function createUser(data: Omit<User, 'userId'>): Promise<User> {
  const user: User = { userId: randomUUID(), ...data };
  await UserModel.create(user);
  return user;
}

/**
 * Get user by ID.
 * @param {string} userId
 * @returns {Promise<Object|undefined>}
 */
export function getUserById(userId: string): Promise<User | undefined> {
  return UserModel.findById(userId);
}

/**
 * Update user by ID.
 * @param {string} userId
 * @param {Object} data
 * @returns {Promise<Object|undefined>}
 */
export function updateUser(
  userId: string,
  data: Partial<User>
): Promise<User | undefined> {
  return UserModel.update(userId, data);
}

/**
 * Delete user by ID.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export function deleteUser(userId: string): Promise<void> {
  return UserModel.deleteById(userId);
}
