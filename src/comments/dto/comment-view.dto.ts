import { AutoMap } from '@automapper/classes';

export class CommentViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  userProfileId: string;

  @AutoMap()
  movieId: string;

  @AutoMap()
  userName: string;

  @AutoMap()
  userEmail: string;

  @AutoMap()
  text: string;
}