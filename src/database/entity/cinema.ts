import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Hall } from './hall';
import { AutoMap } from '@automapper/classes';
import { Address } from './address';
import { BaseEntity } from './base-entity';

@Entity()
export class Cinema extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @OneToOne(() => Address, (address) => address.cinema, { cascade: true })
  @JoinColumn()
  @AutoMap()
  address: Address;

  @OneToMany(() => Hall, (hall) => hall.cinema, { cascade: true })
  @AutoMap()
  halls: Hall[];
}
