import { UpdateTimeToLiveCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '../../src/config/dynamodb.js';

export async function up(): Promise<void> {
  const command = new UpdateTimeToLiveCommand({
    TableName: 'Sessions',
    TimeToLiveSpecification: {
      AttributeName: 'expiresAt',
      Enabled: true
    }
  });
  await ddbDocClient.send(command);
}
