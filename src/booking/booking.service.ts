import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class BookingService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionSeatRepository: SessionSeatRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly bookedOrderRepository: BookedOrderRepository,
  ) {
  }

  async bookTicketsAsync(id: string, bookTicketsDto: BookTicketsDto): Promise<BookedOrderViewDto> {
    const user = await this.userProfileRepository.getById(bookTicketsDto.userProfileId);

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const session = await this.sessionRepository.getById(id)
      .include(x => x.sessionSeats)
      .thenInclude(x => x.seat);

    if (!session) {
      throw new NotFoundException('Session is not exist');
    }
    const bookingOrder = new BookedOrder();
    bookingOrder.user = user;
    bookingOrder.totalPrice = 0;
    bookingOrder.sessionSeats = [];

    for (const sessionSeatId of bookTicketsDto.sessionSeatsId) {
      const sessionSeat: SessionSeat = session.sessionSeats.find(x => x.id == sessionSeatId);
      if (!sessionSeat) {
        throw new InternalServerErrorException('Session seat did not find');
      }
      if (sessionSeat.ticketState !== TicketState.Free) {
        throw new BadRequestException('Seat is already booked');
      }
      sessionSeat.ticketState = TicketState.Booked;
      bookingOrder.totalPrice = bookingOrder.totalPrice + (+sessionSeat.seat.price);
      bookingOrder.sessionSeats.push(sessionSeat);
    }

    bookingOrder.totalPrice = bookingOrder.totalPrice * session.coefficient;

    const bookedOrderCreated = await this.bookedOrderRepository.create(bookingOrder);
    if (!bookedOrderCreated) {
      throw new InternalServerErrorException('Error while book tickets');
    }

    return this.mapper.map(bookedOrderCreated, BookedOrder, BookedOrderViewDto);
  }

  async getSessionDetailsAsync(id: string): Promise<SessionDetailsViewDto> {
    const session = await this.sessionRepository
      .getById(id)
      .include(x => x.hall)
      .thenInclude(x => x.rows)
      .thenInclude(x => x.seats)
      .thenInclude(x => x.seatType)
      .include(x => x.hall)
      .thenInclude(x => x.cinema)
      .thenInclude(x => x.address)
      .include(x => x.movie)
      .thenInclude(x => x.genres)
      .include(x => x.movie)
      .thenInclude(x => x.countries)
      .include(x => x.sessionSeats)
      .thenInclude(x => x.seat);

    if (!session) {
      throw new NotFoundException('Session is not exist');
    }


    const sessionDetails = this.mapper.map(session, Session, SessionDetailsViewDto);
    const sessionSeatTypes: SessionSeatTypeDetailsViewDto[] = [];

    for (const row of sessionDetails.hall.rows) {
      for (const seat of row.seats) {
        const sessionSeat: SessionSeat = session.sessionSeats.find(x => x.seat.id == seat.id);

        if (!sessionSeat) {
          throw new InternalServerErrorException('Session seat did not find');
        }

        seat.price = seat.price * sessionDetails.coefficient;
        seat.ticketState = sessionSeat.ticketState;

        if (!sessionSeatTypes.find(x => x.seatType == seat.seatType)) {
          const sessionSeatType: SessionSeatTypeDetailsViewDto = new SessionSeatTypeDetailsViewDto();
          sessionSeatType.seatType = seat.seatType;
          sessionSeatType.price = seat.price;
          sessionSeatTypes.push(sessionSeatType);
        }
      }
    }

    sessionDetails.sessionSeatTypes = sessionSeatTypes;

    return sessionDetails;
  }
}
