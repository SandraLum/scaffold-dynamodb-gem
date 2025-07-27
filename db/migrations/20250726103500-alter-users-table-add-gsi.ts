import { UpdateTableCommand } from '@aws-sdk/client-dynamodb';
import { ddb } from '../../src/config/dynamodb';
import { config } from '../../src/config';

const gsi = {
  IndexName: 'name-index',
  KeySchema: [{ AttributeName: 'name', KeyType: 'HASH' }],
  Projection: { ProjectionType: 'ALL' },
};

export async function up() {
  await ddb.send(new UpdateTableCommand({
    TableName: config.usersTable,
    AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
    GlobalSecondaryIndexUpdates: [{ Create: gsi }],
  }));
}

export async function down() {
  await ddb.send(new UpdateTableCommand({
    TableName: config.usersTable,
    GlobalSecondaryIndexUpdates: [{ Delete: { IndexName: gsi.IndexName } }],
  }));
}
