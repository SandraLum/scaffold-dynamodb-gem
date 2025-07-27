// filename: src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserSchema, CreateUserInput } from '../types/user.types';

/**
 * Handles the creation of a new user.
 * @param {Request<{}, {}, CreateUserInput>} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const createUserController = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const validatedBody = CreateUserSchema.parse(req.body);
    const newUser = await UserService.createUser(validatedBody);
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
};

/**
 * Handles fetching a single user by ID.
 * @param {Request<{id: string}>} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles fetching all users.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};