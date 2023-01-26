import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { SeatTypeViewDto } from '../dto/seat-type-view.dto';
import { SeatType } from '../../database/entity/seat-type';

@Injectable()
export class SeatTypesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SeatType, SeatTypeViewDto);
    };
  }
}