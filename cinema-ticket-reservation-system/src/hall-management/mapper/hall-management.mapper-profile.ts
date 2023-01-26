import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { HallDto } from '../dto/hall.dto';
import { Hall } from '../../database/entity/hall';
import { SeatDto } from '../dto/seat.dto';
import { Seat } from '../../database/entity/seat';
import { RowDto } from '../dto/row.dto';
import { Row } from '../../database/entity/row';
import { SeatType } from '../../database/entity/seat-type';
import { SeatTypeViewDto } from '../dto/seat-type-view.dto';
import { SeatViewDto } from '../dto/seat-view.dto';
import { RowViewDto } from '../dto/row-view.dto';
import { HallViewDto } from '../dto/hall-view.dto';

@Injectable()
export class HallManagementMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SeatDto, Seat,
        forMember(dest => dest.seatType,
          mapFrom(source => {
            return { id: source.seatTypeId };
          })),
      );
      createMap(mapper, RowDto, Row,
        forMember(dest => dest.seats,
          mapFrom(source => mapper.mapArray(source.seats, SeatDto, Seat))),
      );
      createMap(mapper, HallDto, Hall,
        forMember(dest => dest.rows,
          mapFrom(source => mapper.mapArray(source.rows, RowDto, Row))),
      );

      createMap(mapper, SeatType, SeatTypeViewDto);
      createMap(mapper, Seat, SeatViewDto,
        forMember(dest => dest.seatType,
          mapFrom(source => source.seatType)),
      );
      createMap(mapper, Row, RowViewDto,
        forMember(dest => dest.seats,
          mapFrom(source => mapper.mapArray(source.seats, Seat, SeatViewDto))),
      );
      createMap(mapper, Hall, HallViewDto,
        forMember(dest => dest.rows,
          mapFrom(source => mapper.mapArray(source.rows, Row, RowViewDto))),
        forMember(dest => dest.cinemaId,
          mapFrom(source => source.cinema.id)),
        forMember(dest => dest.cinemaName,
          mapFrom(source => source.cinema.name)),
      );
    };
  }
}