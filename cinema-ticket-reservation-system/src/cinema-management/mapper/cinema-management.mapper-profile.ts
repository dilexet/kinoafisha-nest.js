import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { CinemaDto } from '../dto/cinema.dto';
import { Cinema } from '../../database/entity/cinema';
import { CinemaViewDto } from '../dto/cinema-view.dto';

@Injectable()
export class CinemaManagementMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CinemaDto, Cinema,
        forMember(dest => dest.address,
          mapFrom(source => {
            return {
              country: source.country,
              city: source.city,
              street: source.street,
              houseNumber: source.houseNumber,
            };
          })),
      );

      createMap(mapper, Cinema, CinemaViewDto,
        forMember(dest => dest.country,
          mapFrom(source => source?.address?.country)),
        forMember(dest => dest.city,
          mapFrom(source => source?.address?.city)),
        forMember(dest => dest.street,
          mapFrom(source => source?.address?.street)),
        forMember(dest => dest.houseNumber,
          mapFrom(source => source?.address?.houseNumber)),
      );
    };
  }
}