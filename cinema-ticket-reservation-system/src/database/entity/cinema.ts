import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hall } from './hall';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Hall, hall => hall.cinema)
  halls: Hall[];
}