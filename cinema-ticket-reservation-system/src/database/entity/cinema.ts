import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Hall } from './hall';
import { AutoMap } from '@automapper/classes';
import { Address } from './address';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @OneToOne(() => Address,
    { eager: true, cascade: true })
  @JoinColumn()
  @AutoMap()
  address: Address;

  @OneToMany(() => Hall,
    hall => hall.cinema,
    { eager: true, cascade: true })
  @AutoMap()
  halls: Hall[];
}