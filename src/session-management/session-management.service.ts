import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SessionCreateDto } from './dto/session-create.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Session } from '../database/entity/session';
import { SessionViewDto } from './dto/session-view.dto';
import { SessionSeatViewDto } from './dto/session-seat-view.dto';
import { SessionSeat } from '../database/entity/session-seat';
import { SessionDetailsViewDto } from './dto/session-details-view.dto';
import * as moment from 'moment';
import { SessionUpdateDto } from './dto/session-update.dto';
import { Row } from '../database/entity/row';
import { TicketState } from '../shared/enums/ticket-state.enum';
import { convertDate } from '../shared/utils/convert-date';
import { HallRepository } from '../database/repository/hall.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { SessionRepository } from '../database/repository/session.repository';
import { SessionSeatRepository } from '../database/repository/session-seat.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { BookedOrderRepository } from '../database/repository/booked-order.repository';

@Injectable()
export class SessionManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly hallRepository: HallRepository,
    private readonly movieRepository: MovieRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionSeatRepository: SessionSeatRepository,
    private readonly bookedOrderRepository: BookedOrderRepository,
    @InjectRepository(Session) private readonly sessionTempRepository: Repository<Session>,
  ) {
  }

  async create(sessionDto: SessionCreateDto): Promise<SessionViewDto[]> {
    const hallExist = await this.hallRepository
      .getById(sessionDto?.hallId)
      .include(x => x.cinema)
      .include(x => x.rows)
      .thenInclude(x => x.seats);

    if (!hallExist) {
      throw new BadRequestException('Hall is not exist');
    }

    const movieExist = await this.movieRepository
      .getById(sessionDto?.movieId);

    if (!movieExist) {
      throw new BadRequestException('Movie is not exist');
    }

    const sessionSeats: SessionSeat[] = await this.createSessionSeats(hallExist.rows);

    const sessions: Session[] = [];

    for (const sessionTime of sessionDto.sessionTimes) {
      const sessionStart = moment(sessionTime.startDate)
        .toDate();
      const sessionEnd = moment(sessionTime.startDate)
        .add(movieExist.durationInMinutes + 10, 'minutes')
        .toDate();

      const sessionExistInThisTime = await this.findSessionExistInThisTime(sessionStart, sessionEnd, hallExist?.id);
      if (sessionExistInThisTime) {
        throw new BadRequestException(
          `Session exist in this time (${convertDate(sessionExistInThisTime.startDate)} - ${convertDate(sessionExistInThisTime.endDate)})`);
      }

      const session: Session = new Session();
      session.coefficient = sessionTime.coefficient;
      session.startDate = sessionStart;
      session.endDate = sessionEnd;
      session.sessionSeats = sessionSeats.map(x => ({ ...x, id: undefined }));
      session.hall = hallExist;
      session.movie = movieExist;

      sessions.push(session);
    }

    const sessionsCreated = await this.sessionRepository.create(sessions);

    if (!sessionsCreated) {
      throw new InternalServerErrorException('Error while creating sessions');
    }

    return this.mapper.mapArray(
      sessionsCreated,
      Session,
      SessionViewDto,
    );
  }

  async update(id: string, sessionDto: SessionUpdateDto): Promise<SessionViewDto> {
    const sessionExist = await this.sessionRepository
      .getById(id)
      .include(x => x.sessionSeats)
      .include(x => x.hall)
      .thenInclude(x => x.cinema)
      .include(x => x.movie);

    if (!sessionExist) {
      throw new BadRequestException('Session is not exist');
    }

    const session: Session = new Session();

    if (sessionExist.movie.id != sessionDto.movieId) {
      const movieExist = await this.movieRepository
        .getById(sessionDto?.movieId);

      if (!movieExist) {
        throw new BadRequestException('Movie is not exist');
      }

      session.movie = movieExist;
    } else {
      session.movie = sessionExist.movie;
    }

    if (sessionExist.hall.id != sessionDto.hallId) {
      const hallExist = await this.hallRepository
        .getById(sessionDto?.hallId)
        .include(x => x.cinema)
        .include(x => x.rows)
        .thenInclude(x => x.seats);

      if (!hallExist) {
        throw new BadRequestException('Hall is not exist');
      }

      session.hall = hallExist;
      session.sessionSeats = await this.createSessionSeats(hallExist.rows);
      await this.sessionSeatRepository.delete(sessionExist.sessionSeats);
    } else {
      session.sessionSeats = sessionExist.sessionSeats;
      session.hall = sessionExist.hall;
    }

    const sessionStart = moment(sessionDto.sessionTime.startDate)
      .toDate();
    const sessionEnd = moment(sessionDto.sessionTime.startDate)
      .add(sessionExist.movie.durationInMinutes + 10, 'minutes')
      .toDate();

    const sessionExistInThisTime = await this.findSessionExistInThisTime(sessionStart, sessionEnd, sessionDto?.hallId);
    if (sessionExistInThisTime) {
      throw new BadRequestException(
        `Session exist in this time (${convertDate(sessionExistInThisTime.startDate)} - ${convertDate(sessionExistInThisTime.endDate)})`);
    }

    session.coefficient = sessionDto.sessionTime.coefficient;
    session.startDate = sessionStart;
    session.endDate = sessionEnd;
    session.id = id;

    const sessionUpdated = await this.sessionRepository.update(session);

    if (!sessionUpdated) {
      throw new InternalServerErrorException('Error while updating session');
    }

    return this.mapper.map(
      sessionUpdated,
      Session,
      SessionViewDto,
    );
  }

  async removeFromBooking(seatId: string): Promise<SessionSeatViewDto> {
    const sessionSeat = await this.sessionSeatRepository
      .getById(seatId)
      .include(x => x.session)
      .include(x => x.bookedOrder)
      .include(x => x.seat);

    if (!sessionSeat) {
      throw new BadRequestException('Session seat is not exist');
    }

    if (sessionSeat?.ticketState === TicketState.Free) {
      throw new BadRequestException('Session seat type is free');
    }

    if (sessionSeat?.ticketState === TicketState.Booked) {
      const bookedOrder = await this.bookedOrderRepository
        .getById(sessionSeat?.bookedOrder?.id).include(x => x.sessionSeats);
      bookedOrder.sessionSeats = bookedOrder?.sessionSeats?.filter(x => x.id !== sessionSeat?.id);
      bookedOrder.totalPrice -= sessionSeat?.seat?.price * sessionSeat?.session?.coefficient;
      await this.bookedOrderRepository.update(bookedOrder);
    }

    sessionSeat.ticketState = TicketState.Free;
    sessionSeat.bookedOrder = null;
    sessionSeat.blockedTime = null;

    const sessionSeatUpdated = await this.sessionSeatRepository.update(sessionSeat);

    if (!sessionSeatUpdated) {
      throw new InternalServerErrorException('Error while updating session seat');
    }
    const sessionSeatResult = await this.sessionSeatRepository.getById(seatId)
      .include(x => x.seat)
      .thenInclude(x => x.row)
      .include(x => x.seat)
      .thenInclude(x => x.seatType);
    return this.mapper.map(sessionSeatResult, SessionSeat, SessionSeatViewDto);
  }

  async remove(id: string): Promise<string> {
    try {
      const session = await this.sessionRepository
        .getById(id)
        .include(x => x.sessionSeats);
      session.deleted = true;
      session.sessionSeats = session.sessionSeats?.map(sessionSeat => ({ ...sessionSeat, deleted: true }));
      await this.sessionRepository.update(session);
      return id;
    } catch (err) {
      throw new BadRequestException('Session is not exist');
    }
  }

  async findAll(name: string): Promise<SessionViewDto[]> {
    const sessionQuery = this.sessionRepository
      .getAll()
      .orderBy(x => x.startDate)
      .include(x => x.movie)
      .include(x => x.hall)
      .thenInclude(x => x.cinema);
    const sessions = name
      ? await sessionQuery
        .where(x => x.movie.name)
        .contains(name, { matchCase: false })
        .or(x => x.hall.name)
        .contains(name, { matchCase: false })
        .or(x => x.hall.cinema.name)
        .contains(name, { matchCase: false })
      : await sessionQuery;
    return this.mapper.mapArray(sessions, Session, SessionViewDto);
  }

  async findOne(id: string): Promise<SessionDetailsViewDto> {
    const session = await this.sessionRepository
      .getById(id)
      .include(x => x.movie)
      .include(x => x.hall)
      .thenInclude(x => x.cinema)
      .include(x => x.sessionSeats)
      .thenInclude(x => x.seat)
      .thenInclude(x => x.row)
      .include(x => x.sessionSeats)
      .thenInclude(x => x.seat)
      .thenInclude(x => x.seatType);

    if (!session) {
      throw new NotFoundException('Session is not exist');
    }
    return this.mapper.map(session, Session, SessionDetailsViewDto);
  }

  private async createSessionSeats(rows: Row[]): Promise<SessionSeat[]> {
    const sessionSeats: SessionSeat[] = [];

    for (const row of rows) {
      for (const seat of row.seats) {
        const sessionSeat: SessionSeat = new SessionSeat();
        sessionSeat.seat = seat;
        sessionSeats.push(sessionSeat);
      }
    }

    return sessionSeats;
  }

  private async findSessionExistInThisTime(sessionStart: Date, sessionEnd: Date, hallId: string): Promise<Session> {
    return await this.sessionTempRepository.findOne({
      where: [
        {
          hall: { id: hallId },
          startDate: Between(sessionStart, sessionEnd),
        },
        {
          hall: { id: hallId },
          endDate: Between(sessionStart, sessionEnd),
        },
      ],
    });
  }
}
