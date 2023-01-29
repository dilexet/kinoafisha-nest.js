import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { BookedOrder } from './booked-order';
import { User } from './user';

@Entity()
export class UserProfile {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User,
    user => user.userProfile,
    { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => BookedOrder,
    bookedOrder => bookedOrder.user)
  bookedOrders: BookedOrder[];
}
