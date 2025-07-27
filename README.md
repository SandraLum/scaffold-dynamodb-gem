# Express.js & DynamoDB Production Boilerplate

This project provides a complete, production-ready boilerplate for building scalable web applications using Express.js, TypeScript, and AWS DynamoDB. It features a layered architecture and a robust CLI for managing database migrations and seeding, specifically designed for DynamoDB's schemaless nature.

## ✨ Features

-   **TypeScript First**: Fully typed from the ground up.
-   **Layered Architecture**: Clear separation of concerns (Routes, Controllers, Services, Models).
-   **AWS SDK v3**: Uses modern, modular AWS SDK packages.
-   **Centralized Configuration**: Environment-based configuration using `dotenv`.
-   **Request Validation**: Type-safe request validation with `zod`.
-   **Industrial-Standard DB Migrations**: A powerful CLI to manage DynamoDB schema changes and data seeding.
-   **Production-Ready**: Includes centralized error handling, strict `tsconfig.json`, and best practices.

## 🛠️ Setup & Installation

### 1. Prerequisites

-   Node.js (LTS version, e.g., v20.x)
-   npm or yarn
-   AWS Account & Credentials
-   (Optional) Docker for running DynamoDB Local

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd express-dynamodb-boilerplate
```

### 3. Install Dependencies


```bash
npm install
```

### 4. Set Up Environment Variables
Copy the example environment file and fill in your AWS credentials and configuration.

```bash
cp .env.example .env
```

Open the .env file and add your details:

Code snippet
```
# .env
NODE_ENV=development
PORT=3000

# Your AWS credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

# Optional: If using DynamoDB Local with Docker
# DYNAMODB_ENDPOINT=http://localhost:8000
```

Tip for Local Development: To run DynamoDB locally, you can use the official Docker image:
docker run -p 8000:8000 amazon/dynamodb-local
Then, uncomment the DYNAMODB_ENDPOINT in your .env file.

### 🚀 Running the Application
Start the development server:
The server will automatically restart when you make changes to the code.


```bash
npm run dev
```
Start the server for production:
This requires a build step first.

```bash
npm run build
npm start
```

The application will be available at http://localhost:3000.

### 🗃️ Database Management CLI
This boilerplate includes a powerful CLI for managing database migrations and seeding. It keeps track of executed operations in dedicated Migrations and Seeders tables in DynamoDB to prevent re-running them.

### Migrations
Migrations are used to manage your DynamoDB table structures (e.g., creating tables, adding indexes).

#### Run all pending migrations:
This command checks the Migrations table, finds all migration files that haven't been run, and executes their up function in chronological order.

Bash
```bash
npm run db:migrate
```

#### Revert the last migration:
This command finds the most recently applied migration and executes its down function to roll back the change.

Bash
```bash
npm run db:migrate:undo
```
#### Create a new migration file:
This generates a new timestamped migration file in the db/migrations/ directory from a template.

Bash
```bash
npm run db:migrate:create -- --name <migration-name>
```

```bash
# Example:
npm run db:migrate:create -- --name add-status-to-users
```
The -- is required to pass arguments to the underlying script.

### Seeding
Seeders are used to populate your database with initial or test data.

#### Run all pending seeders:
This command checks the Seeders table and executes any new seeder files from the db/seeders/ directory.

Bash
```bash
npm run db:seed
```
#### Create a new seeder file:
(This feature can be added to the CLI if needed, following the pattern of migrate:create)

Bash
```bash
# Example command to add:
npm run db:seed:create -- --name <seeder-name>
```