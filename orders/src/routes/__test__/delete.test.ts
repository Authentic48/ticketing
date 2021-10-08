import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '../../common/order-status';

describe('GET /api/orders', () => {
  it('marks an order as cancelled', async () => {
    //  create a ticket with Ticket Model
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to create order for this ticket
    const { body: order } = await request(app)
      .post('/api/orders/')
      .set('Cookie', user)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    // Make request to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}/`)
      .set('Cookie', user)
      .send()
      .expect(204);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
});
