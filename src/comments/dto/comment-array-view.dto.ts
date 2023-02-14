import { AutoMap } from '@automapper/classes';
import { CommentInfo } from './comment-info-view.dto';

export class CommentArrayViewDto {
  @AutoMap()
  movieId: string;

  @AutoMap()
  comments: CommentInfo[];
}