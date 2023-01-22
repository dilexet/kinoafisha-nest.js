import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Cinema } from './cinema';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  country: string;

  @Column()
  @AutoMap()
  city: string;

  @Column()
  @AutoMap()
  street: string;

  @Column()
  @AutoMap()
  houseNumber: number;

  @OneToOne(() => Cinema, cinema => cinema.address)
  cinema: Cinema;
}