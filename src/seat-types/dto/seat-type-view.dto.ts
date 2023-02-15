import { AutoMap } from '@automapper/classes';

export class SeatTypeViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
