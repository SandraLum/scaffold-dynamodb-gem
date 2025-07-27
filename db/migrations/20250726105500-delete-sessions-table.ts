// filename: db/migrations/20250726105500-delete-sessions-table.ts
import { DynamoDBClient, DeleteTableCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { config } from '../../src/config';

const TABLE_NAME = config.db.tables.sessions;

/**
 * This is a destructive migration. The 'up' operation deletes the table.
 */
export const up = async (db: DynamoDBClient): Promise<void> => {
  const command = new DeleteTableCommand({ TableName: TABLE_NAME });
  await db.send(command);
  console.warn(`DESTRUCTIVE: Table '${TABLE_NAME}' has been deleted.`);
};

/**
 * The 'down' operation reverts the deletion by recreating the table.
 */
export const down = async (db: DynamoDBClient): Promise<void> => {
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: 'sessionId', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'sessionId', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  });
  await db.send(command);
  console.log(`Table '${TABLE_NAME}' recreated.`);
};