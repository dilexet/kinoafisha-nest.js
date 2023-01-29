import { AutoMap } from '@automapper/classes';

export class RoleViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}