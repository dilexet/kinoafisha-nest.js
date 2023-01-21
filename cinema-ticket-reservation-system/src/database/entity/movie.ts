import {
  Column, Entity,
  ManyToMany, PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Genre } from './genre';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  posterURL: string;

  @Column({ type: 'timestamptz' })
  releaseDate: Date;

  @ManyToMany(() => Genre, genre => genre.movies)
  @JoinTable()
  genres: Genre[];
}