// filename: src/models/user.model.ts
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../config/dynamodb';
import { config } from '../config';
import { User } from '../types/user.types';
import crypto from 'crypto';

const TABLE_NAME = config.db.tables.users;

/**
 * @class UserModel
 * @description Data Access Layer for the Users table in DynamoDB.
 */
export class UserModel {
  /**
   * Creates a new user item in the database.
   * @param {Omit<User, 'userId' | 'createdAt' | 'updatedAt'>} userData - The user data to create.
   * @returns {Promise<User>} The newly created user.
   */
  static async create(userData: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newUser,
    });

    await ddbDocClient.send(command);
    return newUser;
  }

  /**
   * Finds a user by their ID.
   * @param {string} userId - The ID of the user to find.
   * @returns {Promise<User | null>} The found user or null.
   */
  static async findById(userId: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId },
    });

    const { Item } = await ddbDocClient.send(command);
    return (Item as User) || null;
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} A list of all users.
   */
  static async findAll(): Promise<User[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });
    const { Items } = await ddbDocClient.send(command);
    return (Items as User[]) || [];
  }
}