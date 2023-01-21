import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cinema } from './cinema';
import { Row } from './row';

@Entity()
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Cinema, cinema => cinema.halls)
  cinema: Cinema;

  @OneToMany(() => Row, row => row.hall)
  rows: Row[];
}