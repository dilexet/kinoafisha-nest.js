import { AutoMap } from '@automapper/classes';

export class HallViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}