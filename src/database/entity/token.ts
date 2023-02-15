import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { BaseEntity } from './base-entity';

@Entity()
export class Token extends BaseEntity {
  @Column()
  refreshToken: string;

  @Column({ type: 'timestamptz' })
  expireDate: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
