import { AutoMap } from '@automapper/classes';

export class CommentInfo {
  @AutoMap()
  id: string;

  @AutoMap()
  userProfileId: string;

  @AutoMap()
  userName: string;

  @AutoMap()
  userEmail: string;

  @AutoMap()
  createdDate: string;

  @AutoMap()
  text: string;
}
