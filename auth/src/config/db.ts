import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('DB connected!!!');
  } catch (err) {
    console.error(err);
  }
};
