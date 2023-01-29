import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Session } from './session';
import { Seat } from './seat';
import { TicketState } from '../../shared/enums/ticket-state.enum';
import { BookedOrder } from './booked-order';

@Entity()
export class SessionSeat {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column({ type: 'enum', enum: TicketState, default: TicketState.Free })
  @AutoMap()
  ticketState: TicketState;

  @ManyToOne(() => Seat,
    seat => seat.sessionSeats,
    { cascade: true })
  @AutoMap()
  seat: Seat;

  @ManyToOne(() => Session,
    session => session.sessionSeats,
    { onDelete: 'CASCADE' })
  session: Session;

  @ManyToOne(() => BookedOrder,
    bookedOrder => bookedOrder.sessionSeats,
    { onDelete: 'SET NULL' })
  bookedOrder: BookedOrder;
}