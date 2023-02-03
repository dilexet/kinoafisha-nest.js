import { Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BookedOrder } from './booked-order';
import { User } from './user';
import { BaseEntity } from './base-entity';

@Entity()
export class UserProfile extends BaseEntity {
  @OneToOne(() => User,
    user => user.userProfile)
  @JoinColumn()
  user: User;

  @OneToMany(() => BookedOrder,
    bookedOrder => bookedOrder.user)
  bookedOrders: BookedOrder[];
}
