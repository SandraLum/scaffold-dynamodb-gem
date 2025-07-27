import path from 'path';
import { readdir } from 'fs/promises';
const seedersDir = path.resolve('db/seeders');

async function run(): Promise<void> {
  const files = (await readdir(seedersDir))
    .filter((f) => f.endsWith('.ts'))
    .sort();
  for (const file of files) {
    console.log(`Running seeder ${file}`);
    const { seed } = await import(path.join(seedersDir, file));
    await seed();
    console.log(`Finished ${file}`);
  }
  console.log('Seeding complete');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
