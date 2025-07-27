import { readdir } from 'fs/promises';
import path from 'path';
import { ddbDocClient } from '../src/config/dynamodb.js';
import { config } from '../src/config/index.js';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const MIGRATIONS_TABLE = 'Migrations';
const serviceName = config.SERVICE_NAME;
const migrationsDir = path.resolve('db/migrations');

async function getLastApplied(): Promise<string | null> {
  const { Item } = await ddbDocClient.send(
    new GetCommand({
      TableName: MIGRATIONS_TABLE,
      Key: { serviceName },
    })
  );
  return (Item?.lastApplied as string) || null;
}

async function setLastApplied(filename: string): Promise<void> {
  await ddbDocClient.send(
    new PutCommand({
      TableName: MIGRATIONS_TABLE,
      Item: { serviceName, lastApplied: filename },
    })
  );
}

async function run(): Promise<void> {
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.ts'))
    .sort();
  let lastApplied: string | null = await getLastApplied();
  for (const file of files) {
    if (!lastApplied || file > lastApplied) {
      console.log(`Running migration ${file}`);
      const { up } = await import(path.join(migrationsDir, file));
      await up();
      await setLastApplied(file);
      lastApplied = file;
      console.log(`Finished ${file}`);
    }
  }
  console.log('Migrations complete');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
