const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

mongoose.connect('mongodb://localhost:27017/E-commerenceDatebase').then(async () => {
  const User   = mongoose.connection.collection('users');
  const hashed = await bcrypt.hash('admin1234', 12);

  await User.updateOne(
    { email: 'admin@cloudkitchen.com' },
    { $set: { role: 'admin', password: hashed } },
    { upsert: true }
  );

  console.log('✅ Admin ready!');
  console.log('   Email:    admin@cloudkitchen.com');
  console.log('   Password: admin1234');

  mongoose.disconnect();
});