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
        forMember(dest => dest.address,
          mapFrom(source =>
            `${source.address.houseNumber} ${source.address.street}, ${source.address.country}, ${source.address.city}`)),
      );
      // createMap(mapper, Country, CountryViewDto);
      // createMap(mapper, Movie, MovieViewDto,
      //   forMember(
      //     (dest) => dest.countries,
      //     mapFrom(source => source.countries),
      //   ),
      //   forMember(
      //     (dest) => dest.genres,
      //     mapFrom(source => source.genres),
      //   ),
      // );
    };
  }
}