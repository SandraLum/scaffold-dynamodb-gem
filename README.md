# Scaffold DynamoDB Gem

A boilerplate Express.js application using TypeScript and AWS DynamoDB. Includes a unified CLI for managing database migrations and seeders.

## Installation

```bash
npm install
```

Copy `.env.example` to `.env` and adjust the values for your environment.

## Database CLI

All database tasks are performed via `db/cli.ts` and exposed through npm scripts.

### Migrations

Run pending migrations:

```bash
npm run db:migrate
```

Revert the last migration:

```bash
npm run db:migrate:undo
```

Create a new migration:

```bash
npm run db:migrate:create -- --name <migration-name>
```

### Seeders

Run pending seeders:

```bash
npm run db:seed
```

Create a new seeder:

```bash
npm run db:seed:create -- --name <seeder-name>
```

## Running the Server

```bash
npm start
```
