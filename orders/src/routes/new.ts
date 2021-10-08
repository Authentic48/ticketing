import express, { Request, Response } from 'express';
import {
  BadRequest,
  NotFoundError,
  requireAuth,
  validationRequest,
} from '@authentic48/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderStatus } from '../common/order-status';

const router = express.Router();

const EXPIRATION_WINDOW_TIME = 15 * 60;
router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the the database

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run Query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders statuts is *not* cancelled
    // If we find an order from that means the ticket *is* reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequest('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_TIME);

    // Build the order and save it in the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event sayingg that order was created

    return res.status(201).send(order);
  }
);

export { router as createOrderRouter };
