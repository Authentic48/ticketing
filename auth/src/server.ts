import { connectDB } from './config/db';
import { app } from './app';

const PORT = process.env.PORT || 5000;

const start = () => {
  connectDB();

  app.listen(PORT, () => {
    console.log(`App in development is running on ${PORT}`);
  });
};

start();
