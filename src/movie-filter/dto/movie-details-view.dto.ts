import { AutoMap } from '@automapper/classes';
import { MovieViewDto } from './movie-view.dto';
import { CinemaSessionsViewDto } from './cinema-sessions-view.dto';

export class MovieDetailsViewDto extends MovieViewDto {
  @AutoMap()
  description: string;

  @AutoMap()
  durationInMinutes: number;

  cinemaSessions: CinemaSessionsViewDto[];
}