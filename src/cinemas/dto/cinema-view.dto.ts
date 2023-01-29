import { AutoMap } from '@automapper/classes';

export class CinemaViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}