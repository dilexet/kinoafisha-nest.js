import { AutoMap } from '@automapper/classes';

export class GoogleUserDto {
  @AutoMap()
  name: string;
  @AutoMap()
  email: string;
}