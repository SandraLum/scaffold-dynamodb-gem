import { ddbDocClient } from '../config/dynamodb.js';
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

export interface User {
  userId: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

const TABLE_NAME = 'Users';

/**
 * Create a new user.
 * @param {Object} user
 * @returns {Promise<Object>}
 */
export async function create(user: User): Promise<User> {
  await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: user }));
  return user;
}

/**
 * Find a user by ID.
 * @param {string} userId
 * @returns {Promise<Object|undefined>}
 */
export async function findById(userId: string): Promise<User | undefined> {
  const { Item } = await ddbDocClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { userId } })
  );
  return Item as User | undefined;
}

/**
 * Update a user.
 * @param {string} userId
 * @param {Object} data
 * @returns {Promise<Object|undefined>}
 */
export async function update(
  userId: string,
  data: Partial<User>
): Promise<User | undefined> {
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  for (const [key, value] of Object.entries(data)) {
    updateExpressions.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  }
  const UpdateExpression = 'SET ' + updateExpressions.join(', ');
  await ddbDocClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }));
  return findById(userId);
}

/**
 * Delete a user by ID.
 * @param {string} userId
 */
export async function deleteById(userId: string): Promise<void> {
  await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { userId } }));
}
