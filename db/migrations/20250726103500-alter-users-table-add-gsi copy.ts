// filename: db/migrations/20250726103500-alter-users-table-add-gsi.ts
import { DynamoDBClient, UpdateTableCommand } from '@aws-sdk/client-dynamodb';
import { config } from '../../src/config';

const TABLE_NAME = config.db.tables.users;

export const up = async (db: DynamoDBClient): Promise<void> => {
  const command = new UpdateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: 'EmailIndex',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
        },
      },
    ],
  });
  await db.send(command);
  console.log(`GSI 'EmailIndex' added to table '${TABLE_NAME}'.`);
};

export const down = async (db: DynamoDBClient): Promise<void> => {
  const command = new UpdateTableCommand({
    TableName: TABLE_NAME,
    GlobalSecondaryIndexUpdates: [{ Delete: { IndexName: 'EmailIndex' } }],
  });
  await db.send(command);
  console.log(`GSI 'EmailIndex' removed from table '${TABLE_NAME}'.`);
};