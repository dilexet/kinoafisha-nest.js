import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { SessionSeat } from './session-seat';
import { UserProfile } from './user-profile';
import { BaseEntity } from './base-entity';

@Entity()
export class BookedOrder extends BaseEntity {
  @Column({ type: 'decimal' })
  @AutoMap()
  totalPrice: number;

  @ManyToOne(() => UserProfile, (user) => user.bookedOrders, { cascade: true })
  @AutoMap()
  user: UserProfile;

  @OneToMany(() => SessionSeat, (user) => user.bookedOrder, { cascade: true })
  @AutoMap()
  sessionSeats: SessionSeat[];
}
