import { create } from '../../src/models/user.model.js';

export async function seed(): Promise<void> {
  await create({ userId: '1', name: 'Admin', email: 'admin@example.com' });
}
