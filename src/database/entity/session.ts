import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Hall } from './hall';
import { Movie } from './movie';
import { SessionSeat } from './session-seat';
import { BaseEntity } from './base-entity';

@Entity()
export class Session extends BaseEntity {
  @Column({ type: 'timestamptz' })
  @AutoMap()
  startDate: Date;

  @Column({ type: 'timestamptz' })
  @AutoMap()
  endDate: Date;

  @Column({ type: 'decimal' })
  @AutoMap()
  coefficient: number;

  @ManyToOne(() => Movie, (movie) => movie.sessions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @AutoMap()
  movie: Movie;

  @ManyToOne(() => Hall, (hall) => hall.sessions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @AutoMap()
  hall: Hall;

  @OneToMany(() => SessionSeat, (sessionSeat) => sessionSeat.session, {
    cascade: true,
    eager: true,
  })
  @AutoMap()
  sessionSeats: SessionSeat[];
}
