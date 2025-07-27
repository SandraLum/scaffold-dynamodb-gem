import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from '../../src/config/dynamodb.js';

export async function up(): Promise<void> {
  // WARNING: This operation irreversibly deletes the Sessions table.
  // Do NOT run in production environments via automated scripts.
  const command = new DeleteTableCommand({ TableName: 'Sessions' });
  await ddbDocClient.send(command);
}
