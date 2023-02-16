import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BookTicketsDto } from './dto/book-tickets.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SessionRepository } from '../database/repository/session.repository';
import { Session } from '../database/entity/session';
import { SessionDetailsViewDto } from './dto/session-details-view.dto';
import { BookedOrderRepository } from '../database/repository/booked-order.repository';
import { SessionSeatTypeDetailsViewDto } from './dto/session-seat-type-details-view.dto';
import { SessionSeat } from '../database/entity/session-seat';
import { SessionSeatRepository } from '../database/repository/session-seat.repository';
import { BookedOrder } from '../database/entity/booked-order';
import { TicketState } from '../shared/enums/ticket-state.enum';
import { BookedOrderViewDto } from './dto/booked-order-view.dto';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { MoviePopularityService } from '../shared/utils/movie-popularity-service';
import {
  MoviePopularityByBooking,
  MoviePopularityByGetDetails,
} from '../shared/constants/movie-popularity';
import * as moment from 'moment';
import { PayloadArray } from './types/payload';
import { MailService } from '../mail/mail.service';
import { convertAddressToString } from '../shared/utils/convert-address-to-string';
import { convertDateToSessionFormat } from '../shared/utils/convert-date';

@Injectable()
export class BookingService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private mailService: MailService,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionSeatRepository: SessionSeatRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly bookedOrderRepository: BookedOrderRepository,
    private readonly moviePopularityService: MoviePopularityService,
  ) {
  }

  async bookTicketsAsync(
    id: string,
    bookTicketsDto: BookTicketsDto,
  ): Promise<BookedOrderViewDto> {
    const userProfile = await this.userProfileRepository.getById(
      bookTicketsDto.userProfileId,
    ).include(x => x.user);

    if (!userProfile) {
      throw new NotFoundException('User is not exist');
    }

    const session = await this.sessionRepository
      .getById(id)
      .include((x) => x.sessionSeats)
      .thenInclude((x) => x.seat)
      .include((x) => x.movie)
      .include(x => x.hall)
      .thenInclude(x => x.cinema)
      .thenInclude(x => x.address);

    if (!session) {
      throw new NotFoundException('Session is not exist');
    }
    const bookingOrder = new BookedOrder();
    bookingOrder.user = userProfile;
    bookingOrder.totalPrice = 0;
    bookingOrder.sessionSeats = [];

    for (const sessionSeatId of bookTicketsDto.sessionSeatsId) {
      const sessionSeat: SessionSeat = session.sessionSeats.find(
        (x) => x.id == sessionSeatId,
      );
      if (!sessionSeat) {
        throw new InternalServerErrorException('Session seat did not find');
      }
      if (sessionSeat.ticketState === TicketState.Booked) {
        throw new BadRequestException('Seat is already booked');
      }
      sessionSeat.ticketState = TicketState.Booked;
      sessionSeat.blockedTime = null;
      bookingOrder.totalPrice =
        bookingOrder.totalPrice + +sessionSeat.seat.price;
      bookingOrder.sessionSeats.push(sessionSeat);
    }

    bookingOrder.totalPrice = bookingOrder.totalPrice * session.coefficient;

    const bookedOrderCreated = await this.bookedOrderRepository.create(
      bookingOrder,
    );
    if (!bookedOrderCreated) {
      throw new InternalServerErrorException('Error while book tickets');
    }

    await this.moviePopularityService.addPopularityMovie(
      session.movie.id,
      MoviePopularityByBooking,
    );

    try {
      await this.mailService.sendBookingOrderAsync(
        userProfile.user.name,
        userProfile.user.email,
        bookedOrderCreated.id,
        bookedOrderCreated.totalPrice,
        bookedOrderCreated?.sessionSeats?.length,
        convertDateToSessionFormat(session.startDate),
        session.movie.name,
        session.hall.cinema.name,
        session.hall.name,
        convertAddressToString(session.hall.cinema.address),
      );
    } catch (err) {
      throw new InternalServerErrorException('Error while sending email');
    }

    return this.mapper.map(bookedOrderCreated, BookedOrder, BookedOrderViewDto);
  }

  async getSessionDetailsAsync(id: string): Promise<SessionDetailsViewDto> {
    const session = await this.sessionRepository
      .getById(id)
      .include((x) => x.hall)
      .thenInclude((x) => x.rows)
      .thenBy((x) => x.numberRow)
      .thenInclude((x) => x.seats)
      .thenBy((x) => x.numberSeat)
      .thenInclude((x) => x.seatType)
      .include((x) => x.hall)
      .thenInclude((x) => x.cinema)
      .thenInclude((x) => x.address)
      .include((x) => x.movie)
      .thenInclude((x) => x.genres)
      .include((x) => x.movie)
      .thenInclude((x) => x.countries)
      .include((x) => x.sessionSeats)
      .thenInclude((x) => x.seat);

    if (!session) {
      throw new NotFoundException('Session is not exist');
    }

    const sessionDetails = this.mapper.map(
      session,
      Session,
      SessionDetailsViewDto,
    );
    const sessionSeatTypes: SessionSeatTypeDetailsViewDto[] = [];

    for (const row of sessionDetails.hall.rows) {
      for (const seat of row.seats) {
        const sessionSeat: SessionSeat = session.sessionSeats.find(
          (x) => x.seat.id == seat.id,
        );

        if (!sessionSeat) {
          throw new InternalServerErrorException('Session seat did not find');
        }

        seat.price = seat.price * sessionDetails.coefficient;
        seat.ticketState = sessionSeat.ticketState;
        seat.sessionSeatId = sessionSeat.id;

        if (
          !sessionSeatTypes.find((seatType) => seatType.name == seat.seatType)
        ) {
          const sessionSeatType: SessionSeatTypeDetailsViewDto =
            new SessionSeatTypeDetailsViewDto();
          sessionSeatType.id = seat.seatTypeId;
          sessionSeatType.name = seat.seatType;
          sessionSeatType.price = seat.price;
          sessionSeatTypes.push(sessionSeatType);
        }
      }
    }

    await this.moviePopularityService.addPopularityMovie(
      session.movie.id,
      MoviePopularityByGetDetails,
    );

    sessionDetails.sessionSeatTypes = sessionSeatTypes;

    return sessionDetails;
  }

  async blockSessionSeat(sessionSeatId: string): Promise<string> {
    const sessionSeat = await this.sessionSeatRepository.getById(sessionSeatId);

    if (!sessionSeat || sessionSeat?.ticketState !== TicketState.Free) {
      return null;
    }

    sessionSeat.ticketState = TicketState.Blocked;
    sessionSeat.blockedTime = new Date();
    const result = await this.sessionSeatRepository.update(sessionSeat);

    return result?.id;
  }

  async unlockSessionSeat(sessionSeatId: string): Promise<string> {
    const sessionSeat = await this.sessionSeatRepository.getById(sessionSeatId);

    if (!sessionSeat) {
      return null;
    }

    sessionSeat.ticketState = TicketState.Free;
    sessionSeat.blockedTime = null;
    const result = await this.sessionSeatRepository.update(sessionSeat);

    return result?.id;
  }

  async unlockSessionSeats(sessionSeatIds: string[]): Promise<string[]> {
    if (!sessionSeatIds || sessionSeatIds?.length <= 0) {
      return null;
    }

    if (typeof sessionSeatIds === 'string') {
      const id = await this.unlockSessionSeat(sessionSeatIds);
      if (id) {
        return [id];
      }
      return null;
    }

    let sessionSeats = await this.sessionSeatRepository
      .getAll()
      .where((x) => x.id)
      .in(sessionSeatIds);

    if (!sessionSeats) {
      return null;
    }

    sessionSeats = sessionSeats.map((sessionSeat) => ({
      ...sessionSeat,
      ticketState: TicketState.Free,
      blockedTime: null,
    }));

    const result = await this.sessionSeatRepository.update(sessionSeats);

    return result?.map((x) => x.id);
  }

  async clearExpiresSessionSeats(): Promise<PayloadArray[]> {
    const expireTime = moment(new Date()).subtract(15, 'minutes').toDate();
    const sessionSeatsExpires = await this.sessionSeatRepository
      .getAll()
      .include((x) => x.session)
      .where((x) => x.blockedTime)
      .lessThanOrEqual(expireTime);

    if (sessionSeatsExpires?.length <= 0) {
      return null;
    }

    const payload: PayloadArray[] = [];

    for (const sessionSeat of sessionSeatsExpires) {
      sessionSeat.ticketState = TicketState.Free;
      sessionSeat.blockedTime = null;
      const sessionExist = payload?.find(
        (x) => x?.sessionId === sessionSeat?.session?.id,
      );
      if (!sessionExist) {
        payload.push({
          sessionId: sessionSeat?.session?.id,
          sessionSeatIds: sessionSeatsExpires
            .filter((x) => x.session?.id === sessionSeat?.session?.id)
            .map((x) => x.id),
          userSessionId: null,
        });
      }
    }

    try {
      await this.sessionSeatRepository.update(sessionSeatsExpires);
      return payload;
    } catch (e) {
      return null;
    }
  }
}
