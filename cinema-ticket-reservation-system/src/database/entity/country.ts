import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @ManyToMany(() => Movie, movie => movie.countries)
  movies: Movie[];
}