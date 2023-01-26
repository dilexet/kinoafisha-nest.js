import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}