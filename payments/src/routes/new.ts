import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@authentic48/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import cookieSession from 'cookie-session';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/pubishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    // TODO: for better understanding and navigation in codebase to someone new, it is also good idea to create a 
    //       stripe module that abstract away all the stripe logic and functionality into a meaningful interfaces
    //       and servics which in turn you new up here and call, for example, having this code like:
    //        const paymementService = new PaymentService();
    //        await paymentService.createOrderPayment({ orderId, amount...etc })
    //       
    //       this helps you create a more unit-testable code (Not integration tests, thats another thing)
    //       because sometimes you or teams should create Unit-tests instead of integration tests.
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    // TODO: and inside this payment service, any database calls also should  be handled inside
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
      id: payment.id,
      stripeId: payment.stripeId,
    });
    return res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
