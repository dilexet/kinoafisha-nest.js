import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Role } from './role';
import { Token } from './token';
import { AutoMap } from '@automapper/classes';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ default: false })
  isActivated: boolean;

  @Column({ nullable: true })
  activationLink: string;

  @ManyToOne(() => Role,
    role => role.users,
    { eager: true })
  role: Role;

  @OneToMany(() => Token, token => token.user)
  tokens: Token[];
}
