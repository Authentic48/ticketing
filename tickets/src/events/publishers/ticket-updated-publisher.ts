import { Publihser, TicketUpdatedEvent, Subjects } from '@authentic48/common';

export class TicketUpdatedPublisher extends Publihser<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
