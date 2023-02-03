import { Column, Entity, ManyToMany } from 'typeorm';
import { Movie } from './movie';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base-entity';

@Entity()
export class Country extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @ManyToMany(() => Movie,
    movie => movie.countries)
  movies: Movie[];
}