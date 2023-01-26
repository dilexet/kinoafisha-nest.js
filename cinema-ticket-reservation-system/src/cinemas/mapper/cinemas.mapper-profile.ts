import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CinemaViewDto } from '../dto/cinema-view.dto';
import { Cinema } from '../../database/entity/cinema';

@Injectable()
export class CinemasMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Cinema, CinemaViewDto);
    };
  }
}