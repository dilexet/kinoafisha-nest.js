import { AutoMap } from '@automapper/classes';

export class HallViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  cinemaId: string;

  @AutoMap()
  cinemaName: string;

  @AutoMap()
  name: string;

  @AutoMap()
  numberOfRows: number;

  @AutoMap()
  numberOfSeats: number;
}
