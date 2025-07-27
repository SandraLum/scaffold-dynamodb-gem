// filename: db/seeders/20250726110000-seed-initial-users.ts
import { UserModel } from '../../src/models/user.model';

export const run = async (): Promise<void> => {
  console.log('Seeding initial users...');
  
  const usersToSeed = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
  ];

  for (const userData of usersToSeed) {
    try {
      await UserModel.create(userData);
      console.log(`Seeded user: ${userData.name}`);
    } catch (error) {
      console.error(`Failed to seed user ${userData.name}:`, error);
    }
  }
  
  console.log('Finished seeding users.');
};