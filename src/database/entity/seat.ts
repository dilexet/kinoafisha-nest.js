import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Row } from './row';
import { SeatType } from './seat-type';
import { AutoMap } from '@automapper/classes';
import { SessionSeat } from './session-seat';
import { BaseEntity } from './base-entity';

@Entity()
export class Seat extends BaseEntity {
  @Column()
  @AutoMap()
  numberSeat: number;

  @Column({ type: 'decimal' })
  @AutoMap()
  price: number;

  @ManyToOne(() => Row, (row) => row.seats, { onDelete: 'CASCADE' })
  row: Row;

  @ManyToOne(() => SeatType, (seatType) => seatType.seats, { eager: true })
  @AutoMap()
  seatType: SeatType;

  @OneToMany(() => SessionSeat, (sessionSeat) => sessionSeat.session)
  sessionSeats: SessionSeat[];
}
