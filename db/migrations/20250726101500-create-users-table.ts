import { CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { ddb } from '../../src/config/dynamodb';
import { config } from '../../src/config';

export async function up() {
  const cmd = new CreateTableCommand({
    TableName: config.usersTable,
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });
  await ddb.send(cmd);
}

export async function down() {
  await ddb.send(new DeleteTableCommand({ TableName: config.usersTable }));
}
