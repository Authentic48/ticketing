export enum OrderStatus {
  // When the order has been created, but the
  // ticket ity is trying to order has not been reserved
  Created = 'created',
  // The ticket the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order
  // The order expires before payment
  Cancelled = 'cancelled',

  // the order has successfully reserved the ticket
  AwaitingPayment = 'await:payment',

  // The order has reserved the ticket and the user has
  // provided payment successfully
  Complete = 'complete',
}
