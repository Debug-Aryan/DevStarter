import mongoose from 'mongoose';

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Set it in server/.env (see .env.example).');
  }

  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log('✅ MongoDB connected');
}
