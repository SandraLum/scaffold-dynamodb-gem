import { promises as fs } from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ddb } from '../src/config/dynamodb';
import { config } from '../src/config';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const MIGRATION_SERVICE = 'user-service';

interface Migration {
  up: () => Promise<void>;
  down: () => Promise<void>;
}

async function getState(table: string): Promise<string[]> {
  const result = await ddb.send(
    new GetCommand({ TableName: table, Key: { serviceName: MIGRATION_SERVICE } })
  );
  return result.Item?.applied ?? [];
}

async function setState(table: string, applied: string[]): Promise<void> {
  await ddb.send(
    new PutCommand({ TableName: table, Item: { serviceName: MIGRATION_SERVICE, applied } })
  );
}

async function runMigrations(direction: 'up' | 'down') {
  const files = await fs.readdir(path.join(__dirname, 'migrations'));
  files.sort();
  const applied = await getState(config.migrationsTable);

  if (direction === 'up') {
    const pending = files.filter(f => !applied.includes(f));
    for (const file of pending) {
      const migration: Migration = await import(path.join(__dirname, 'migrations', file));
      await migration.up();
      applied.push(file);
      await setState(config.migrationsTable, applied);
      console.log(`Applied migration ${file}`);
    }
  } else {
    const file = applied.pop();
    if (!file) {
      console.log('No migrations to revert');
      return;
    }
    const migration: Migration = await import(path.join(__dirname, 'migrations', file));
    await migration.down();
    await setState(config.migrationsTable, applied);
    console.log(`Reverted migration ${file}`);
  }
}

async function createMigration(name: string) {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const fileName = `${timestamp}-${name}.ts`;
  const template = `import { CreateTableCommand, DeleteTableCommand, UpdateTableCommand, UpdateTimeToLiveCommand } from '@aws-sdk/client-dynamodb';
import { ddb } from '../../src/config/dynamodb';

export async function up() {
  // TODO: implement migration
}

export async function down() {
  // TODO: implement rollback
}
`;
  await fs.writeFile(path.join(__dirname, 'migrations', fileName), template);
  console.log(`Created migration ${fileName}`);
}

async function runSeeders() {
  const files = await fs.readdir(path.join(__dirname, 'seeders'));
  files.sort();
  const applied = await getState(config.seedersTable);
  const pending = files.filter(f => !applied.includes(f));
  for (const file of pending) {
    const seeder = await import(path.join(__dirname, 'seeders', file));
    await seeder.run();
    applied.push(file);
    await setState(config.seedersTable, applied);
    console.log(`Executed seeder ${file}`);
  }
}

async function createSeeder(name: string) {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const fileName = `${timestamp}-${name}.ts`;
  const template = `import { ddb } from '../../src/config/dynamodb';

export async function run() {
  // TODO: implement seeder
}
`;
  await fs.writeFile(path.join(__dirname, 'seeders', fileName), template);
  console.log(`Created seeder ${fileName}`);
}

yargs(hideBin(process.argv))
  .command('migrate <action>', 'Manage migrations', y => {
    return y.positional('action', { describe: 'up|down|create', type: 'string' })
      .option('name', { type: 'string', describe: 'Name of migration' });
  }, async argv => {
    if (argv.action === 'up') await runMigrations('up');
    else if (argv.action === 'down') await runMigrations('down');
    else if (argv.action === 'create') {
      if (!argv.name) throw new Error('Name is required');
      await createMigration(argv.name as string);
    }
  })
  .command('seed <action>', 'Manage seeders', y => {
    return y.positional('action', { describe: 'run|create', type: 'string' })
      .option('name', { type: 'string', describe: 'Name of seeder' });
  }, async argv => {
    if (argv.action === 'run') await runSeeders();
    else if (argv.action === 'create') {
      if (!argv.name) throw new Error('Name is required');
      await createSeeder(argv.name as string);
    }
  })
  .demandCommand()
  .strict()
  .help()
  .parse();
