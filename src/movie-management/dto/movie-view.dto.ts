import { AutoMap } from '@automapper/classes';
import { GenreViewDto } from './genre-view.dto';
import { CountryViewDto } from './country-view.dto';

export class MovieViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  premiereDate: string;

  @AutoMap()
  durationInMinutes: number;

  @AutoMap()
  genres: GenreViewDto[];

  @AutoMap()
  countries: CountryViewDto[];

  @AutoMap()
  posterURL: string;
}
