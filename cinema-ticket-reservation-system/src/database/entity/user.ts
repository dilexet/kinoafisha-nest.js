import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Role } from './role';
import { Token } from './token';
import { AutoMap } from '@automapper/classes';
import { AuthProviderEnum } from '../../shared/enums/auth-provider.enum';

@Entity()
export class User {
  @AutoMap()
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

  @Column({ default: AuthProviderEnum.LOCAL })
  provider: string;

  @AutoMap()
  @Column({ default: false })
  isActivated: boolean;

  @AutoMap()
  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  activationLink: string;

  @AutoMap()
  @ManyToOne(() => Role,
    role => role.users,
    { eager: true })
  role: Role;

  @OneToMany(() => Token, token => token.user)
  tokens: Token[];
}
