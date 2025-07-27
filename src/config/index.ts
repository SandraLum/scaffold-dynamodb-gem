import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration loaded from environment variables.
 */
export const config = {
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamoEndpoint: process.env.DYNAMODB_ENDPOINT,
  usersTable: process.env.USERS_TABLE || 'Users',
  migrationsTable: process.env.MIGRATIONS_TABLE || 'Migrations',
  seedersTable: process.env.SEEDERS_TABLE || 'Seeders',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};
