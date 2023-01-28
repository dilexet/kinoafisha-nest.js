import { AutoMap } from '@automapper/classes';

export class SessionViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  startDate: string;

  @AutoMap()
  endDate: string;

  @AutoMap()
  coefficient: number;

  @AutoMap()
  movieId: string;

  @AutoMap()
  movieName: string;

  @AutoMap()
  cinemaId: string;

  @AutoMap()
  cinemaName: string;

  @AutoMap()
  hallId: string;

  @AutoMap()
  hallName: string;
}
