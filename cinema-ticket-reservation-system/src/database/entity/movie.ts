import {
  Column, Entity,
  ManyToMany, PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Genre } from './genre';
import { Country } from './country';
import { AutoMap } from '@automapper/classes';

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

  @ManyToMany(() => Genre,
    genre => genre.movies,
    { eager: true })
  @JoinTable()
  @AutoMap()
  genres: Genre[];

  @ManyToMany(() => Country,
    country => country.movies,
    { eager: true })
  @JoinTable()
  @AutoMap()
  countries: Country[];
}