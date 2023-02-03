import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Hall } from './hall';
import { Movie } from './movie';
import { SessionSeat } from './session-seat';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column({ type: 'timestamptz' })
  @AutoMap()
  startDate: Date;

  @Column({ type: 'timestamptz' })
  @AutoMap()
  endDate: Date;

  @Column({ type: 'decimal' })
  @AutoMap()
  coefficient: number;

  @ManyToOne(() => Movie,
    movie => movie.sessions,
    { cascade: true, onDelete: 'SET NULL' })
  @AutoMap()
  movie: Movie;

  @ManyToOne(() => Hall,
    hall => hall.sessions,
    { cascade: true, onDelete: 'SET NULL' })
  @AutoMap()
  hall: Hall;

  @OneToMany(() => SessionSeat,
    sessionSeat => sessionSeat.session,
    { cascade: true, eager: true })
  @AutoMap()
  sessionSeats: SessionSeat[];
}