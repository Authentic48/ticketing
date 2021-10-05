import { connectDB } from './config/db';
import { app } from './app';
import { natsWrapper } from './config/nats-wrapper';

const PORT = process.env.PORT || 5000;

const start = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  connectDB();

  natsWrapper.connect('ticketing', '123', 'http://nats-srv:4222');

  app.listen(PORT, () => {
    console.log(`App in development is running on ${PORT}`);
  });
};

start();
