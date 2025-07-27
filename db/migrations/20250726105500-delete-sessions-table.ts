import { DeleteTableCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { ddb } from '../../src/config/dynamodb';

const tableName = 'Sessions';

export async function up() {
  await ddb.send(new DeleteTableCommand({ TableName: tableName }));
}

export async function down() {
  await ddb.send(new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: 'sessionId', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'sessionId', KeyType: 'HASH' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  }));
}
