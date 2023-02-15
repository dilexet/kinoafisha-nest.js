import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base-entity';

@Entity()
export class Role extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
