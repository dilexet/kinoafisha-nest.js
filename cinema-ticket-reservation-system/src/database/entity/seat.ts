import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Row } from './row';
import { SeatType } from './seat-type';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  numberSeat: number;

  @Column()
  @AutoMap()
  price: number;

  @ManyToOne(() => Row,
    row => row.seats)
  row: Row;

  @ManyToOne(() => SeatType,
    seatType => seatType.seats,
    { eager: true })
  @AutoMap()
  seatType: SeatType;
}