import { requireAuth } from '@authentic48/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderStatus } from '../common/order-status';
import { NotAuthorizedError, NotFoundError } from '@authentic48/common';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    return res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
