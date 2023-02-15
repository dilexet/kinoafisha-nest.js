import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { MovieViewDto } from '../dto/movie-view.dto';
import { Movie } from '../../database/entity/movie';

@Injectable()
export class MoviesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Movie, MovieViewDto);
    };
  }
}
