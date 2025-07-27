// filename: src/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

/**
 * @description Typed application configuration loaded from environment variables.
 */
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  aws: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT, // Optional: for local development
  },
  db: {
    tables: {
      users: 'Users',
      sessions: 'Sessions',
      migrations: 'Migrations',
      seeders: 'Seeders',
    },
    serviceName: 'app-main', // Used as PK for versioning tables
  }
};

// Basic validation to ensure critical env vars are set
if (!config.aws.region || !config.aws.accessKeyId || !config.aws.secretAccessKey) {
  throw new Error('Missing critical AWS configuration in environment variables.');
}