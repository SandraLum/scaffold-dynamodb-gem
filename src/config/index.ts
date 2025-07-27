import dotenv from 'dotenv';

export interface AppConfig {
  PORT?: string;
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  DYNAMO_ENDPOINT?: string;
  SERVICE_NAME: string;
}

/** Load environment variables from `.env`. */
dotenv.config();

export const config: AppConfig = {
  PORT: process.env.PORT,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
  SERVICE_NAME: process.env.SERVICE_NAME || 'scaffold-service'
};
