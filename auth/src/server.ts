import { connectDB } from './config/db';
import { app } from './app';

const PORT = process.env.PORT || 5000;

const start = () => {
  if (!process.env.JWT_KEY) { // TODO: see file /config/index.ts
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) { // TODO: see file /config/index.ts
    throw new Error('MONGO_URI must be defined');
  }

  connectDB();

  app.listen(PORT, () => {
    // TODO: it is recommended and cleaner to use real logger like Pino, Morgan, Winston
    //       when you work in realworld project a solid logging instrument helps a lot to
    //       find and fix bus easily.
    console.log(`App in development is running on ${PORT}`);
  });
};

start();
