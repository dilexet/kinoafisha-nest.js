import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { GenreViewDto } from '../dto/genre-view.dto';
import { Genre } from '../../database/entity/genre';

@Injectable()
export class GenresMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Genre, GenreViewDto);
    };
  }
}