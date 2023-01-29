import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { UserProfile } from '../../database/entity/user-profile';
import { UserProfileViewDto } from '../dto/user-profile-view.dto';
import { AuthProviderEnum } from '../../shared/enums/auth-provider.enum';
import { BookedOrder } from '../../database/entity/booked-order';
import { UserBookedOrderViewDto } from '../dto/user-booked-order-view.dto';
import { BookedSeatViewDto } from '../dto/booked-seat-view.dto';
import { SessionSeat } from '../../database/entity/session-seat';
import { UserProfileUpdateViewDto } from '../dto/user-profile-update-view.dto';
import { User } from '../../database/entity/user';

@Injectable()
export class UserProfileMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SessionSeat, BookedSeatViewDto,
        forMember(dest => dest.sessionSeatId,
          mapFrom(source => source.id)),
        forMember(dest => dest.numberSeat,
          mapFrom(source => source.seat.numberSeat)),
        forMember(dest => dest.numberRow,
          mapFrom(source => source.seat.row.numberRow)),
        forMember(dest => dest.seatType,
          mapFrom(source => source.seat.seatType.name)),
        forMember(dest => dest.price,
          mapFrom(source => source.seat.price * source.session.coefficient)),
      );

      createMap(mapper, BookedOrder, UserBookedOrderViewDto,
        forMember(dest => dest.seats,
          mapFrom(source => mapper.mapArray(source.sessionSeats, SessionSeat, BookedSeatViewDto))),
      );

      createMap(mapper, User, UserProfileUpdateViewDto,
        forMember(dest => dest.name,
          mapFrom(source => source.name)),
        forMember(dest => dest.email,
          mapFrom(source => source.email)),
        forMember(dest => dest.isActivated,
          mapFrom(source => source.isActivated)),
        forMember(dest => dest.isRegisteredLocal,
          mapFrom(source => source.provider == AuthProviderEnum.LOCAL)),
      );

      createMap(mapper, UserProfile, UserProfileViewDto,
        forMember(dest => dest.name,
          mapFrom(source => source.user.name)),
        forMember(dest => dest.email,
          mapFrom(source => source.user.email)),
        forMember(dest => dest.isActivated,
          mapFrom(source => source.user.isActivated)),
        forMember(dest => dest.isRegisteredLocal,
          mapFrom(source => source.user.provider == AuthProviderEnum.LOCAL)),
        forMember(dest => dest.orders,
          mapFrom(source =>
            mapper.mapArray(source.bookedOrders, BookedOrder, UserBookedOrderViewDto))),
      );
    };
  }
}