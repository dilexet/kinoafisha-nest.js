import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';


@Injectable()
export class SessionManagementMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
    };
  }
}