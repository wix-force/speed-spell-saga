const User = require('../modules/user/user.model');

async function seedAdmin() {
  const exists = await User.findOne({ email: 'admin@gmail.com' });
  if (exists) {
    console.log('✓ Admin user already exists');
    return;
  }

  await User.create({
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    rating: 2000,
  });

  console.log('✓ Admin user created (admin@gmail.com / admin123)');
}

module.exports = seedAdmin;
