import { Column, Entity, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Session } from './session';
import { Seat } from './seat';
import { TicketState } from '../../shared/enums/ticket-state.enum';
import { BookedOrder } from './booked-order';
import { BaseEntity } from './base-entity';

@Entity()
export class SessionSeat extends BaseEntity {
  @Column({ type: 'enum', enum: TicketState, default: TicketState.Free })
  @AutoMap()
  ticketState: TicketState;

  @ManyToOne(() => Seat,
    seat => seat.sessionSeats,
    { cascade: true })
  @AutoMap()
  seat: Seat;

  @ManyToOne(() => Session,
    session => session.sessionSeats)
  session: Session;

  @ManyToOne(() => BookedOrder,
    bookedOrder => bookedOrder.sessionSeats)
  bookedOrder: BookedOrder;
}