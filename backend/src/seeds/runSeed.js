const connectDB = require('../config/db');
const seedAdmin = require('./admin.seed');
const seedPassages = require('./passage.seed');

async function run() {
  try {
    await connectDB();
    console.log('\n🌱 Running seeds...\n');

    await seedAdmin();
    await seedPassages();

    console.log('\n✅ All seeds completed!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

run();
