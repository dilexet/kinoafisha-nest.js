import { AutoMap } from '@automapper/classes';

export class MovieDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  posterURL: string;

  @AutoMap()
  premiereDate: string;

  @AutoMap()
  durationInMinutes: number;

  @AutoMap()
  genres: string[];

  @AutoMap()
  countries: string[];
}