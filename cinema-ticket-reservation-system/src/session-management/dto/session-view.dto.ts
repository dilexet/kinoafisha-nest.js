import { AutoMap } from '@automapper/classes';

export class SessionViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  startDate: Date;

  @AutoMap()
  endDate: Date;

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
