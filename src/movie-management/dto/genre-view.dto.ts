import { AutoMap } from '@automapper/classes';

export class GenreViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
