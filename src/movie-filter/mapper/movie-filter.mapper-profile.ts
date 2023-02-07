import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Movie } from '../../database/entity/movie';
import { MovieViewDto } from '../dto/movie-view.dto';
import { GenreViewDto } from '../dto/genre-view.dto';
import { Country } from '../../database/entity/country';
import { CountryViewDto } from '../dto/country-view.dto';
import { Genre } from '../../database/entity/genre';
import { MovieDetailsViewDto } from '../dto/movie-details-view.dto';
import { CinemaViewDto } from '../dto/cinema-view.dto';
import { Cinema } from '../../database/entity/cinema';
import { SessionViewDto } from '../dto/session-view.dto';
import { Session } from '../../database/entity/session';
import { hallWorkLoadCalculation } from '../../shared/utils/hall-work-load-calculation';
import { convertDate } from '../../shared/utils/convert-date';

@Injectable()
export class MovieFilterMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Genre, GenreViewDto);
      createMap(mapper, Country, CountryViewDto);

      createMap(mapper, Cinema, CinemaViewDto,
        forMember(dest => dest.address,
          mapFrom(source =>
            `${source.address.houseNumber} ${source.address.street}, ${source.address.city}, ${source.address.country}`)),
      );

      createMap(mapper, Session, SessionViewDto,
        forMember(dest => dest.startDate,
          mapFrom(source => convertDate(source.startDate))),
        forMember(dest => dest.hallName,
          mapFrom(source => source.hall.name)),
        forMember(dest => dest.hallWorkLoad,
          mapFrom(source => hallWorkLoadCalculation(source.sessionSeats))),
      );

      createMap(mapper, Movie, MovieViewDto,
        forMember(dest => dest.premiereDate,
          mapFrom(source => convertDate(source.premiereDate))),
        forMember(dest => dest.countries,
          mapFrom(source => mapper.mapArray(source.countries, Country, CountryViewDto))),
        forMember(dest => dest.genres,
          mapFrom(source => mapper.mapArray(source.genres, Genre, GenreViewDto))),
      );

      createMap(mapper, Movie, MovieDetailsViewDto,
        forMember(dest => dest.premiereDate,
          mapFrom(source => convertDate(source.premiereDate))),
        forMember(dest => dest.countries,
          mapFrom(source => mapper.mapArray(source.countries, Country, CountryViewDto))),
        forMember(dest => dest.genres,
          mapFrom(source => mapper.mapArray(source.genres, Genre, GenreViewDto))),
      );
    };
  }
}