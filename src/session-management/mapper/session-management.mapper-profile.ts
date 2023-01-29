import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { SessionSeat } from '../../database/entity/session-seat';
import { SessionSeatViewDto } from '../dto/session-seat-view.dto';
import { Session } from '../../database/entity/session';
import { SessionViewDto } from '../dto/session-view.dto';
import { SessionDetailsViewDto } from '../dto/session-details-view.dto';
import { convertDate } from '../../shared/utils/convert-date';


@Injectable()
export class SessionManagementMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SessionSeat, SessionSeatViewDto,
        forMember(dest => dest.seatId,
          mapFrom(source => source.seat.id)),
        forMember(dest => dest.numberSeat,
          mapFrom(source => source.seat.numberSeat)),

        forMember(dest => dest.price,
          mapFrom(source => source.seat.price)),
        forMember(dest => dest.seatType,
          mapFrom(source => source.seat.seatType.name)),

        forMember(dest => dest.numberRow,
          mapFrom(source => source.seat.row.numberRow)),

        forMember(dest => dest.ticketState,
          mapFrom(source => source.ticketState.toString())),
      );

      createMap(mapper, Session, SessionViewDto,
        forMember(dest => dest.startDate,
          mapFrom(source => convertDate(source.startDate))),
        forMember(dest => dest.endDate,
          mapFrom(source => convertDate(source.endDate))),
        forMember(dest => dest.movieId,
          mapFrom(source => source.movie.id)),
        forMember(dest => dest.movieName,
          mapFrom(source => source.movie.name)),

        forMember(dest => dest.cinemaId,
          mapFrom(source => source.hall.cinema.id)),
        forMember(dest => dest.cinemaName,
          mapFrom(source => source.hall.cinema.name)),

        forMember(dest => dest.hallId,
          mapFrom(source => source.hall.id)),
        forMember(dest => dest.hallName,
          mapFrom(source => source.hall.name)),
      );


      createMap(mapper, Session, SessionDetailsViewDto,
        forMember(dest => dest.sessionData.startDate,
          mapFrom(source => convertDate(source.startDate))),
        forMember(dest => dest.sessionData.endDate,
          mapFrom(source => convertDate(source.endDate))),
        forMember(dest => dest.sessionData,
          mapFrom(source => mapper.map(source, Session, SessionViewDto))),
        forMember(dest => dest.sessionSeats,
          mapFrom(source => mapper.mapArray(source.sessionSeats, SessionSeat, SessionSeatViewDto))),
      );
    };
  }
}