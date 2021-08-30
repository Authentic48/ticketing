import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@authentic48/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.get('/api/users/test', (req, res) => {
  res.send("it's working fine");
});
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
