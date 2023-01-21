import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hall } from './hall';
import { Seat } from './seat';

@Entity()
export class Row {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numberRow: number;

  @ManyToOne(() => Hall, hall => hall.rows)
  hall: Hall;

  @OneToMany(() => Seat, seat => seat.row)
  seats: Seat[];
}