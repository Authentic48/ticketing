import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest } from '@authentic48/common';
import { Ticket } from '../models/ticket';

const route = express.Router();

route.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();
    return res.status(201).send(ticket);
  }
);

export { route as createTicketRouter };
