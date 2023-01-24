import {
  Column, Entity,
  ManyToMany, PrimaryGeneratedColumn,
  JoinTable, OneToMany,
} from 'typeorm';
import { Genre } from './genre';
import { Country } from './country';
import { AutoMap } from '@automapper/classes';
import { Session } from './session';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  posterURL: string;

  @Column({ type: 'timestamptz' })
  @AutoMap()
  premiereDate: Date;

  @Column()
  @AutoMap()
  durationInMinutes: number;

  @OneToMany(() => Session,
    session => session.movie)
  @AutoMap()
  sessions: Session[];

  @ManyToMany(() => Genre,
    genre => genre.movies)
  @JoinTable()
  @AutoMap()
  genres: Genre[];

  @ManyToMany(() => Country,
    country => country.movies)
  @JoinTable()
  @AutoMap()
  countries: Country[];
}