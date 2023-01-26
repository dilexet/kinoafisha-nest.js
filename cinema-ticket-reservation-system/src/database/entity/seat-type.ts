import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from './seat';
import { AutoMap } from '@automapper/classes';

@Entity()
export class SeatType {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @OneToOne(() => Seat,
    seat => seat.seatType)
  seats: Seat[];
}