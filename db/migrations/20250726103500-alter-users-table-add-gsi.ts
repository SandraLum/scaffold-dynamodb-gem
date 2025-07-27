import { UpdateTableCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '../../src/config/dynamodb.js';

export async function up(): Promise<void> {
  const command = new UpdateTableCommand({
    TableName: 'Users',
    AttributeDefinitions: [
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: 'EmailIndex',
          KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      }
    ]
  });
  await ddbDocClient.send(command);
}
