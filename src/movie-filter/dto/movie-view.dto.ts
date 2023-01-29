import { AutoMap } from '@automapper/classes';
import { GenreViewDto } from './genre-view.dto';
import { CountryViewDto } from './country-view.dto';

export class MovieViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  posterURL: string;

  @AutoMap()
  premiereDate: string;

  @AutoMap()
  genres: GenreViewDto[];

  @AutoMap()
  countries: CountryViewDto[];
}