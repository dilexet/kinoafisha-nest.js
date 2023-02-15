import { Column, Entity, OneToOne } from 'typeorm';
import { Seat } from './seat';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base-entity';

@Entity()
export class SeatType extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @OneToOne(() => Seat, (seat) => seat.seatType)
  seats: Seat[];
}
