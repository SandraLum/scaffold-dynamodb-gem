// filename: src/config/dynamodb.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from './index';

/**
 * @description Creates and configures the DynamoDB client.
 * For local development, it can connect to a DynamoDB Local instance.
 */
const ddbClient = new DynamoDBClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  // Use the endpoint for DynamoDB Local if provided
  ...(config.aws.dynamoDbEndpoint && { endpoint: config.aws.dynamoDbEndpoint }),
});

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false,
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true,
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: true,
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false,
};

/**
 * @description The DynamoDB Document Client simplifies working with items in Amazon DynamoDB.
 * It uses native JavaScript objects instead of `AttributeValue` objects.
 */
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

/**
 * @description The base DynamoDB client, useful for control plane operations like creating tables.
 */
export const ddb = ddbClient;