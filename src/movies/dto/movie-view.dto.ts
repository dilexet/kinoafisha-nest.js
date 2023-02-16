import { AutoMap } from '@automapper/classes';

export class MovieViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
