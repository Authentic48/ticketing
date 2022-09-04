import { connectDB } from './config/db';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { ExpirationcompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const PORT = process.env.PORT || 5000;

const start = async () => {
  // TODO: you can move all this Config code validation to a separate config module that reads the env variables
  //       and validate them with Joi npm package and fail on app start up if env var are not correctly set.
  //       see Auth app in src/config/index.ts
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  connectDB();

  // TODO: IMO i'd move all this NATs setup and startup code to a NATs module similar to config module
  //       and there do all the start up logic and validation and exports some services so other modules
  //       can use to interact with NATs stuff.
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationcompleteListener(natsWrapper.client).listen();
  new PaymentCreatedListener(natsWrapper.client).listen();
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  app.listen(PORT, () => {
    console.log(`App in development is running on ${PORT}`);
  });
};

start();
