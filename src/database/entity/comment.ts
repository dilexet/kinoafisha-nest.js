import {
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { UserProfile } from './user-profile';
import { AutoMap } from '@automapper/classes';
import { Movie } from './movie';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  @AutoMap()
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @AutoMap()
  createdDate: Date;

  @ManyToOne(() => UserProfile, (user) => user.comments, { eager: true })
  @JoinColumn()
  userProfile: UserProfile;

  @ManyToOne(() => Movie, (movie) => movie.comments, { eager: true })
  @JoinColumn()
  movie: Movie;
}
