import { Entity, Column, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Role } from './role';
import { Token } from './token';
import { AutoMap } from '@automapper/classes';
import { AuthProviderEnum } from '../../shared/enums/auth-provider.enum';
import { UserProfile } from './user-profile';
import { BaseEntity } from './base-entity';

@Entity()
export class User extends BaseEntity {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @AutoMap()
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

  @OneToOne(() => UserProfile,
    userProfile => userProfile.user,
    { cascade: true, eager: true })
  userProfile: UserProfile;

  @AutoMap()
  @ManyToOne(() => Role,
    role => role.users,
    { eager: true })
  role: Role;

  @OneToMany(() => Token,
    token => token.user)
  tokens: Token[];
}
