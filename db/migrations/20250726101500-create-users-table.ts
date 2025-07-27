import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '../../src/config/dynamodb.js';

export async function up(): Promise<void> {
  const command = new CreateTableCommand({
    TableName: 'Users',
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  });
  await ddbDocClient.send(command);
}
