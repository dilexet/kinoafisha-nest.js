import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { SessionSeat } from './session-seat';
import { UserProfile } from './user-profile';

@Entity()
export class BookedOrder {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column({ type: 'decimal' })
  @AutoMap()
  totalPrice: number;

  @ManyToOne(() => UserProfile,
    user => user.bookedOrders,
    { cascade: true })
  @AutoMap()
  user: UserProfile;

  @OneToMany(() => SessionSeat,
    user => user.bookedOrder,
    { cascade: true })
  @AutoMap()
  sessionSeats: SessionSeat[];
}