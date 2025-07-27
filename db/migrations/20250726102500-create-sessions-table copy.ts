// filename: db/migrations/20250726102500-create-sessions-table.ts
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { config } from '../../src/config';

const TABLE_NAME = config.db.tables.sessions;

export const up = async (db: DynamoDBClient): Promise<void> => {
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: 'sessionId', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'sessionId', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  });
  await db.send(command);
  console.log(`Table '${TABLE_NAME}' created.`);
};

export const down = async (db: DynamoDBClient): Promise<void> => {
  const command = new DeleteTableCommand({ TableName: TABLE_NAME });
  await db.send(command);
  console.log(`Table '${TABLE_NAME}' deleted.`);
};