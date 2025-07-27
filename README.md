# Scaffold DynamoDB Express Application

This project provides a boilerplate Express.js application using AWS DynamoDB with a lightweight migration system written in **TypeScript**.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Migrations

Migration scripts live in `db/migrations/` and are executed sequentially using a DynamoDB table named `Migrations` to track progress.

- `20250726101500-create-users-table.ts` – creates the `Users` table.
- `20250726102500-create-sessions-table.ts` – creates the `Sessions` table.
- `20250726103500-alter-users-table-add-gsi.ts` – adds the `EmailIndex` GSI on the `Users` table.
- `20250726104500-update-sessions-table-enable-ttl.ts` – enables TTL on the `Sessions` table via the `expiresAt` attribute.
- `20250726105500-delete-sessions-table.ts` – **destructive operation** that deletes the `Sessions` table.

Run migrations:
```bash
npm run migrate
```

## Seeder

Example seeders are located in `db/seeders/`. Run all seeders with:
```bash
npm run seed
```

## Running the Server

Start the server (after building) with:
```bash
npm start
```

The API is available under `/api/v1/users` with CRUD operations.
