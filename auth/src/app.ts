import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@authentic48/common';

import { signUp } from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(signUp);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
