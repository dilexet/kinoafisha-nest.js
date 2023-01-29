import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Session } from '../../database/entity/session';
import { SessionDetailsViewDto } from '../dto/session-details-view.dto';
import { hallWorkLoadCalculation } from '../../shared/utils/hall-work-load-calculation';
import { Movie } from '../../database/entity/movie';
import { MovieDetailsViewDto } from '../dto/movie-details-view.dto';
import { HallDetailsViewDto } from '../dto/hall-details-view.dto';
import { Hall } from '../../database/entity/hall';
import { Row } from '../../database/entity/row';
import { RowDetailsViewDto } from '../dto/row-details-view.dto';
import { SeatDetailsViewDto } from '../dto/seat-details-view.dto';
import { Seat } from '../../database/entity/seat';
import { BookedOrder } from '../../database/entity/booked-order';
import { BookedOrderViewDto } from '../dto/booked-order-view.dto';
import { convertDate } from '../../shared/utils/convert-date';

@Injectable()
export class BookTicketsMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, BookedOrder, BookedOrderViewDto,
        forMember(dest => dest.numberOfTickets,
          mapFrom(source => source.sessionSeats.length)),
      );

      createMap(mapper, Movie, MovieDetailsViewDto,
        forMember(dest => dest.premiereDate,
          mapFrom(source => convertDate(source.premiereDate))),
          forMember(dest => dest.genres,
            mapFrom(source => source.genres.map(x => x.name))),
          forMember(dest => dest.countries,
            mapFrom(source => source.countries.map(x => x.name))),
        );

      createMap(mapper, Seat, SeatDetailsViewDto,
        forMember(dest => dest.seatType,
          mapFrom(source => source.seatType.name)),
      );

      createMap(mapper, Row, RowDetailsViewDto,
        forMember(dest => dest.seats,
          mapFrom(source => mapper.mapArray(source.seats, Seat, SeatDetailsViewDto))),
      );

      createMap(mapper, Hall, HallDetailsViewDto,
        forMember(dest => dest.cinemaName,
          mapFrom(source => source.cinema.name)),
        forMember(dest => dest.address,
          mapFrom(source =>
            `${source.cinema.address.houseNumber} ${source.cinema.address.street}, ${source.cinema.address.city}, ${source.cinema.address.country}`)),
        forMember(dest => dest.rows,
          mapFrom(source => mapper.mapArray(source.rows, Row, RowDetailsViewDto))),
      );

      createMap(mapper, Session, SessionDetailsViewDto,
        forMember(dest => dest.startDate,
          mapFrom(source => convertDate(source.startDate))),
        forMember(dest => dest.endDate,
          mapFrom(source => convertDate(source.endDate))),
        forMember(dest => dest.hallWorkLoad,
          mapFrom(source => hallWorkLoadCalculation(source.sessionSeats))),
        forMember(dest => dest.movie,
          mapFrom(source => mapper.map(source.movie, Movie, MovieDetailsViewDto))),
        forMember(dest => dest.hall,
          mapFrom(source => mapper.map(source.hall, Hall, HallDetailsViewDto))),
      );
    };
  }
}