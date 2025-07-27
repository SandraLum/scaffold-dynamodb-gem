import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../config/dynamodb';
import { config } from '../config';
import { User } from '../types/user.types';

/**
 * Data Access Layer for Users table.
 */
export class UserModel {
  private table = config.usersTable;

  /**
   * Creates a new user.
   */
  async create(user: User): Promise<User> {
    await ddb.send(new PutCommand({ TableName: this.table, Item: user }));
    return user;
  }

  /**
   * Finds a user by their ID.
   */
  async findById(userId: string): Promise<User | null> {
    const result = await ddb.send(
      new GetCommand({ TableName: this.table, Key: { userId } })
    );
    return result.Item as User || null;
  }

  /**
   * Updates a user.
   */
  async update(userId: string, updates: Partial<User>): Promise<User | null> {
    const updateExpr: string[] = [];
    const exprAttrValues: Record<string, any> = {};
    Object.entries(updates).forEach(([key, value]) => {
      updateExpr.push(`#${key} = :${key}`);
      exprAttrValues[`:${key}`] = value;
    });
    const result = await ddb.send(
      new UpdateCommand({
        TableName: this.table,
        Key: { userId },
        UpdateExpression: `SET ${updateExpr.join(', ')}`,
        ExpressionAttributeNames: Object.keys(updates).reduce(
          (acc, key) => ({ ...acc, [`#${key}`]: key }),
          {}
        ),
        ExpressionAttributeValues: exprAttrValues,
        ReturnValues: 'ALL_NEW',
      })
    );
    return result.Attributes as User || null;
  }

  /**
   * Deletes a user by ID.
   */
  async delete(userId: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: this.table, Key: { userId } }));
  }

  /**
   * Lists all users.
   */
  async list(): Promise<User[]> {
    const result = await ddb.send(new ScanCommand({ TableName: this.table }));
    return (result.Items as User[]) || [];
  }
}

export const userModel = new UserModel();
