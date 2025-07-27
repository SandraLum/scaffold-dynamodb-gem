// filename: db/cli.ts
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../src/config';
import { ddb } from '../src/config/dynamodb';
import { DynamoDBClient, ScanCommand, GetItemCommand, UpdateItemCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const SEEDERS_DIR = path.join(__dirname, 'seeders');

// Helper to manage versioning table
const getAppliedItems = async (tableName: string): Promise<string[]> => {
    try {
        const command = new GetItemCommand({
            TableName: tableName,
            Key: { serviceName: { S: config.db.serviceName } },
        });
        const { Item } = await ddb.send(command);
        return Item?.applied?.L?.map(item => item.S || '') || [];
    } catch (error: any) {
        if (error.name === 'ResourceNotFoundException') {
            await ddb.send(new CreateTableCommand({
                TableName: tableName,
                AttributeDefinitions: [{ AttributeName: 'serviceName', AttributeType: 'S' }],
                KeySchema: [{ AttributeName: 'serviceName', KeyType: 'HASH' }],
                BillingMode: 'PAY_PER_REQUEST',
            }));
            console.log(`Created versioning table: ${tableName}`);
            return [];
        }
        throw error;
    }
};

const updateAppliedItems = async (tableName: string, applied: string[]) => {
    const command = new UpdateItemCommand({
        TableName: tableName,
        Key: { serviceName: { S: config.db.serviceName } },
        UpdateExpression: 'SET applied = :applied',
        ExpressionAttributeValues: { ':applied': { L: applied.map(item => ({ S: item })) } },
    });
    await ddb.send(command);
};

// Yargs CLI definition
yargs(hideBin(process.argv))
    .command('migrate:up', 'Run pending migrations', async () => {
        console.log('Running migrations...');
        const appliedMigrations = await getAppliedItems(config.db.tables.migrations);
        const migrationFiles = await fs.readdir(MIGRATIONS_DIR);
        const pendingMigrations = migrationFiles
            .filter(file => file.endsWith('.ts') && !appliedMigrations.includes(file))
            .sort();

        if (pendingMigrations.length === 0) {
            console.log('No pending migrations to run.');
            return;
        }

        for (const file of pendingMigrations) {
            console.log(`Applying migration: ${file}`);
            const migration = await import(path.join(MIGRATIONS_DIR, file));
            await migration.up(ddb);
            appliedMigrations.push(file);
            await updateAppliedItems(config.db.tables.migrations, appliedMigrations);
            console.log(`Applied migration: ${file}`);
        }
        console.log('All migrations applied successfully.');
    })
    .command('migrate:down', 'Revert the last applied migration', async () => {
        const appliedMigrations = await getAppliedItems(config.db.tables.migrations);
        if (appliedMigrations.length === 0) {
            console.log('No migrations to revert.');
            return;
        }

        const lastMigrationFile = appliedMigrations[appliedMigrations.length - 1];
        console.log(`Reverting migration: ${lastMigrationFile}`);
        const migration = await import(path.join(MIGRATIONS_DIR, lastMigrationFile));
        await migration.down(ddb);
        appliedMigrations.pop();
        await updateAppliedItems(config.db.tables.migrations, appliedMigrations);
        console.log(`Reverted migration: ${lastMigrationFile}`);
    })
    .command('migrate:create', 'Create a new migration file', {
        name: { type: 'string', demandOption: true, describe: 'The name of the migration' },
    }, async (argv) => {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
        const filename = `${timestamp}-${argv.name}.ts`;
        const template = `
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

/**
 * Description of what this migration does.
 */
export const up = async (db: DynamoDBClient): Promise<void> => {
  // Add your migration logic here
  console.log('Applying migration for ${argv.name}: UP');
  // Example: const command = new CreateTableCommand({...});
  // await db.send(command);
};

export const down = async (db: DynamoDBClient): Promise<void> => {
  // Add your rollback logic here
  console.log('Reverting migration for ${argv.name}: DOWN');
  // Example: const command = new DeleteTableCommand({...});
  // await db.send(command);
};
`;
        await fs.writeFile(path.join(MIGRATIONS_DIR, filename), template.trim());
        console.log(`Created migration: ${filename}`);
    })
    .command('seed:run', 'Run all seeder files', async () => {
        console.log('Running seeders...');
        const appliedSeeders = await getAppliedItems(config.db.tables.seeders);
        const seederFiles = await fs.readdir(SEEDERS_DIR);
        const pendingSeeders = seederFiles
            .filter(file => file.endsWith('.ts') && !appliedSeeders.includes(file))
            .sort();

        if (pendingSeeders.length === 0) {
            console.log('No new seeders to run.');
            return;
        }

        for (const file of pendingSeeders) {
            console.log(`Running seeder: ${file}`);
            const seeder = await import(path.join(SEEDERS_DIR, file));
            await seeder.run();
            appliedSeeders.push(file);
            await updateAppliedItems(config.db.tables.seeders, appliedSeeders);
            console.log(`Ran seeder: ${file}`);
        }
        console.log('All seeders ran successfully.');
    })
    .demandCommand(1, 'You need to specify a command.')
    .strict()
    .help()
    .argv;