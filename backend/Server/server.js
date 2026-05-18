const dotenv   = require('dotenv');
dotenv.config({ path: './config.env' });

const app      = require('./../App/app');
const mongoose = require('mongoose');

const PORT      = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/E-commerenceDatebase';

mongoose.connect('mongodb://Admin:Admin1234@ac-xxxxx.mongodb.net:27017/E-commerenceDatebase?authSource=admin&tls=true', {
  serverSelectionTimeoutMS: 30000,
}).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
  process.exit(1);
});
