import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from './base-entity';
import { UserProfile } from './user-profile';
import { AutoMap } from '@automapper/classes';
import { Movie } from './movie';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  @AutoMap()
  text: string;

  @ManyToOne(() => UserProfile,
    user => user.comments, { eager: true })
  @JoinColumn()
  userProfile: UserProfile;

  @ManyToOne(() => Movie,
    movie => movie.comments, { eager: true })
  @JoinColumn()
  movie: Movie;
}
