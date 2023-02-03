import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Hall } from './hall';
import { Seat } from './seat';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base-entity';

@Entity()
export class Row extends BaseEntity {
  @Column()
  @AutoMap()
  numberRow: number;

  @ManyToOne(() => Hall,
    hall => hall.rows)
  hall: Hall;

  @OneToMany(() => Seat,
    seat => seat.row,
    { cascade: true, eager: true })
  @AutoMap(() => Seat)
  seats: Seat[];
}