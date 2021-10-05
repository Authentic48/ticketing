import { Publihser, TicketCreatedEvent, Subjects } from '@authentic48/common';

export class TicketCreatedPublisher extends Publihser<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
