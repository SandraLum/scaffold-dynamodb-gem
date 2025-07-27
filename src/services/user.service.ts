// filename: src/services/user.service.ts
import { UserModel } from '../models/user.model';
import { CreateUserInput, User } from '../types/user.types';
import { HttpError } from '../middlewares/errorHandler';

/**
 * @class UserService
 * @description Contains business logic for user-related operations.
 */
export class UserService {
  /**
   * Creates a new user.
   * @param {CreateUserInput} userData - The data for the new user.
   * @returns {Promise<User>} The created user.
   */
  static async createUser(userData: CreateUserInput): Promise<User> {
    // In a real application, you might check if the email is already taken.
    return UserModel.create(userData);
  }

  /**
   * Gets a user by their ID.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<User>} The found user.
   * @throws {HttpError} If the user is not found.
   */
  static async getUserById(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    return user;
  }

  /**
   * Gets all users.
   * @returns {Promise<User[]>} A list of all users.
   */
  static async getAllUsers(): Promise<User[]> {
    return UserModel.findAll();
  }
}