import { AutoMap } from '@automapper/classes';
import { RoleViewDto } from './role-view.dto';

export class UserViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  provider: string;

  @AutoMap()
  isActivated: boolean;

  @AutoMap()
  isBlocked: boolean;

  @AutoMap()
  role: RoleViewDto;
}
