import { Column, Entity, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Cinema } from './cinema';
import { BaseEntity } from './base-entity';

@Entity()
export class Address extends BaseEntity {
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

  @OneToOne(() => Cinema,
    cinema => cinema.address)
  cinema: Cinema;
}