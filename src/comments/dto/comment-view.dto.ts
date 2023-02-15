import { AutoMap } from '@automapper/classes';
import { CommentInfo } from './comment-info-view.dto';

export class CommentViewDto {
  @AutoMap()
  movieId: string;

  @AutoMap()
  comment: CommentInfo;
}
