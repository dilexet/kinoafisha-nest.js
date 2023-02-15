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

  @Column({ type: 'timestamptz', nullable: true, default: null })
  blockedTime: Date;

  @ManyToOne(() => Seat, (seat) => seat.sessionSeats, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @AutoMap()
  seat: Seat;

  @ManyToOne(() => Session, (session) => session.sessionSeats, {
    onDelete: 'CASCADE',
  })
  session: Session;

  @ManyToOne(() => BookedOrder, (bookedOrder) => bookedOrder.sessionSeats, {
    onDelete: 'SET NULL',
  })
  bookedOrder: BookedOrder;
}
