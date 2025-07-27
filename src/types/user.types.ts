/**
 * Represents a user entity stored in DynamoDB.
 */
export interface User {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
