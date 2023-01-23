import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cinema } from './cinema';
import { Row } from './row';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @ManyToOne(() => Cinema,
    cinema => cinema.halls)
  cinema: Cinema;

  @OneToMany(() => Row,
    row => row.hall,
    { cascade: true })
  @AutoMap(() => Row)
  rows: Row[];
}