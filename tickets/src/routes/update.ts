import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validationRequest,
  NotAuthorizedError,
  NotFoundError,
} from '@authentic48/common';
import { Ticket } from '../models/ticket';

const route = express.Router();

route.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('title must be valid'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    return res.send(ticket);
  }
);

export { route as updateTicketRoute };
