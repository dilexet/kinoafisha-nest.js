import {
  Column, Entity,
  ManyToMany, JoinTable, OneToMany,
} from 'typeorm';
import { Genre } from './genre';
import { Country } from './country';
import { AutoMap } from '@automapper/classes';
import { Session } from './session';
import { BaseEntity } from './base-entity';
import { Comment } from './comment';

@Entity()
export class Movie extends BaseEntity {
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

  @Column({ default: 0 })
  popularity: number;

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

  @OneToMany(() => Comment,
    comment => comment.movie)
  comments: Comment[];
}