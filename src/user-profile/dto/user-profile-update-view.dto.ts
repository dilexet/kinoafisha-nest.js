import { AutoMap } from '@automapper/classes';

export class UserProfileUpdateViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  isActivated: boolean;

  @AutoMap()
  isRegisteredLocal: boolean;
}
