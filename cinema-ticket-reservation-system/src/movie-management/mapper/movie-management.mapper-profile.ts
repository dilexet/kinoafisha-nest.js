import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { MovieDto } from '../dto/movie.dto';
import { Movie } from '../../database/entity/movie';
import { MovieViewDto } from '../dto/movie-view.dto';
import { Country } from '../../database/entity/country';
import { Genre } from '../../database/entity/genre';
import { CountryViewDto } from '../dto/country-view.dto';
import { GenreViewDto } from '../dto/genre-view.dto';
import { convertDate } from '../../shared/utils/convert-date';

@Injectable()
export class MovieManagementMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, MovieDto, Movie);

      createMap(mapper, Genre, GenreViewDto);
      createMap(mapper, Country, CountryViewDto);
      createMap(mapper, Movie, MovieViewDto,
        forMember(dest => dest.premiereDate,
          mapFrom(source => convertDate(source.premiereDate))),
        forMember(
          (dest) => dest.countries,
          mapFrom(source => source?.countries),
        ),
        forMember(
          (dest) => dest.genres,
          mapFrom(source => source?.genres),
        ),
      );
    };
  }
}