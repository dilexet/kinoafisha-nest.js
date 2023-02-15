import { Column, Entity, ManyToMany } from 'typeorm';
import { Movie } from './movie';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base-entity';

@Entity()
export class Genre extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}
