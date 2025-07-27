import { userModel } from '../../src/models/user.model';

export async function run() {
  await userModel.create({
    userId: '1',
    email: 'admin@example.com',
    name: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
