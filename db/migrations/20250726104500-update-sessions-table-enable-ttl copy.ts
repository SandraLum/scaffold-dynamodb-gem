// filename: db/migrations/20250726104500-update-sessions-table-enable-ttl.ts
import { DynamoDBClient, UpdateTimeToLiveCommand } from '@aws-sdk/client-dynamodb';
import { config } from '../../src/config';

const TABLE_NAME = config.db.tables.sessions;

export const up = async (db: DynamoDBClient): Promise<void> => {
  const command = new UpdateTimeToLiveCommand({
    TableName: TABLE_NAME,
    TimeToLiveSpecification: {
      Enabled: true,
      AttributeName: 'expiresAt', // This attribute must be a Number (Epoch time)
    },
  });
  await db.send(command);
  console.log(`TTL enabled on 'expiresAt' attribute for table '${TABLE_NAME}'.`);
};

export const down = async (db: DynamoDBClient): Promise<void> => {
  const command = new UpdateTimeToLiveCommand({
    TableName: TABLE_NAME,
    TimeToLiveSpecification: {
      Enabled: false,
      AttributeName: 'expiresAt',
    },
  });
  await db.send(command);
  console.log(`TTL disabled for table '${TABLE_NAME}'.`);
};