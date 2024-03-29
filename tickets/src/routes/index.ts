
// TODO: maybe you should name this file to `get-ticket` instead of index.ts.
//       you have same issue in other apps.
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const route = express.Router();

route.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  return res.status(200).send(tickets);
});

export { route as indexTicketRoute };
