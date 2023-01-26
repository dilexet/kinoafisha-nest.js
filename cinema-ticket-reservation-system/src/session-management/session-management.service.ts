import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SessionCreateDto } from './dto/session-create.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../database/entity/session';
import { SessionViewDto } from './dto/session-view.dto';
import { SessionSeatViewDto } from './dto/session-seat-view.dto';
import { Movie } from '../database/entity/movie';
import { Hall } from '../database/entity/hall';
import { SessionSeat } from '../database/entity/session-seat';
import { SessionDetailsViewDto } from './dto/session-details-view.dto';
import * as moment from 'moment';
import { SessionUpdateDto } from './dto/session-update.dto';
import { Row } from '../database/entity/row';
import { TicketState } from '../shared/enums/ticket-state.enum';

@Injectable()
export class SessionManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Hall) private readonly hallRepository: Repository<Hall>,
    @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
    @InjectRepository(SessionSeat) private readonly sessionSeatRepository: Repository<SessionSeat>,
  ) {
  }

  // TODO: check if hall is free
  // TODO: timezones !
  // TODO: hall work load in session for users
  async create(sessionDto: SessionCreateDto): Promise<SessionViewDto[]> {
    const hallExist = await this.hallRepository.findOne(
      {
        where:
          {
            id: sessionDto.hallId,
          },
        relations: { rows: true, cinema: true },
      });

    if (!hallExist) {
      throw new BadRequestException('Hall is not exist');
    }

    const movieExist = await this.movieRepository.findOneBy(
      { id: sessionDto.movieId });

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

      const session: Session = new Session();
      session.coefficient = sessionTime.coefficient;
      session.startDate = sessionStart;
      session.endDate = sessionEnd;
      session.sessionSeats = sessionSeats.map(x => ({ ...x, id: undefined }));
      session.hall = hallExist;
      session.movie = movieExist;

      sessions.push(session);
    }

    const sessionsCreated = await this.sessionRepository.save(sessions);

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
    const sessionExist = await this.sessionRepository.findOne({
      where: { id: id },
      relations: { hall: { cinema: true }, movie: true, sessionSeats: true },
    });

    if (!sessionExist) {
      throw new BadRequestException('Session is not exist');
    }

    const session: Session = new Session();

    if (sessionExist.movie.id != sessionDto.movieId) {
      const movieExist = await this.movieRepository.findOneBy(
        { id: sessionDto.movieId });

      if (!movieExist) {
        throw new BadRequestException('Movie is not exist');
      }

      session.movie = movieExist;
    } else {
      session.movie = sessionExist.movie;
    }

    if (sessionExist.hall.id != sessionDto.hallId) {
      const hallExist = await this.hallRepository.findOne(
        {
          where:
            {
              id: sessionDto.hallId,
            },
          relations: { rows: true, cinema: true },
        });

      if (!hallExist) {
        throw new BadRequestException('Hall is not exist');
      }

      session.hall = hallExist;
      session.sessionSeats = await this.createSessionSeats(hallExist.rows);
      await this.sessionSeatRepository.delete(sessionExist.sessionSeats.map(x => x.id));
    } else {
      session.sessionSeats = sessionExist.sessionSeats;
      session.hall = sessionExist.hall;
    }

    const sessionStart = moment(sessionDto.sessionTime.startDate)
      .toDate();
    const sessionEnd = moment(sessionDto.sessionTime.startDate)
      .add(sessionExist.movie.durationInMinutes + 10, 'minutes')
      .toDate();

    session.coefficient = sessionDto.sessionTime.coefficient;
    session.startDate = sessionStart;
    session.endDate = sessionEnd;
    session.id = id;

    const sessionUpdated = await this.sessionRepository.save(session);

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
    const sessionSeat = await this.sessionSeatRepository.findOne(
      {
        where: { id: seatId },
        relations: { seat: { row: true } },
      },
    );

    if (!sessionSeat) {
      throw new BadRequestException('Session seat is not exist');
    }

    sessionSeat.ticketState = TicketState.Free;

    const sessionSeatUpdated = await this.sessionSeatRepository.save(sessionSeat);

    if (!sessionSeatUpdated) {
      throw new InternalServerErrorException('Error while updating session seat');
    }

    return this.mapper.map(sessionSeatUpdated, SessionSeat, SessionSeatViewDto);
  }

  async remove(id: string): Promise<string> {
    try {
      await this.sessionRepository.delete(id);
      return id;
    } catch (err) {
      throw new BadRequestException('Session is not exist');
    }
  }

  async findAll(): Promise<SessionViewDto[]> {
    const sessions = await this.sessionRepository.find(
      {
        relations: {
          movie: true,
          hall: { cinema: true },
          sessionSeats: false,
        },
      });
    return this.mapper.mapArray(sessions, Session, SessionViewDto);
  }

  async findOne(id: string): Promise<SessionDetailsViewDto> {
    const session = await this.sessionRepository.findOne(
      {
        where: { id: id },
        relations: {
          movie: true,
          hall: { cinema: true },
          sessionSeats: { seat: { row: true } },
        },
      });

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
}
