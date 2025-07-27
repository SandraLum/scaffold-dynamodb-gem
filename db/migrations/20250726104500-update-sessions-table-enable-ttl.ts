import { UpdateTimeToLiveCommand } from '@aws-sdk/client-dynamodb';
import { ddb } from '../../src/config/dynamodb';

const tableName = 'Sessions';

export async function up() {
  await ddb.send(new UpdateTimeToLiveCommand({
    TableName: tableName,
    TimeToLiveSpecification: {
      AttributeName: 'expiresAt',
      Enabled: true,
    },
  }));
}

export async function down() {
  await ddb.send(new UpdateTimeToLiveCommand({
    TableName: tableName,
    TimeToLiveSpecification: {
      AttributeName: 'expiresAt',
      Enabled: false,
    },
  }));
}
