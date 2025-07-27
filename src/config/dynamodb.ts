import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from './index.js';

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
  endpoint: config.DYNAMO_ENDPOINT,
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);
