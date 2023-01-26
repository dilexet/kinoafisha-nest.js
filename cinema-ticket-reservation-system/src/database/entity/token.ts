import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'timestamptz' })
  expireDate: Date;

  @ManyToOne(() => User, user => user.tokens)
  user: User;
}
