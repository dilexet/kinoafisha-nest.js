import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hall } from './hall';
import { Seat } from './seat';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Row {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  numberRow: number;

  @ManyToOne(() => Hall,
    hall => hall.rows,
    { onDelete: 'CASCADE' })
  hall: Hall;

  @OneToMany(() => Seat,
    seat => seat.row,
    { cascade: true, eager: true })
  @AutoMap(() => Seat)
  seats: Seat[];
}