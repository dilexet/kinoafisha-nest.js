import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieFilterQueryDto } from './dto/movie-filter-query.dto';
import { MovieViewDto } from './dto/movie-view.dto';
import { MovieDetailsViewDto } from './dto/movie-details-view.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { MovieRepository } from '../database/repository/movie.repository';
import { Movie } from '../database/entity/movie';
import { SessionRepository } from '../database/repository/session.repository';
import { Session } from '../database/entity/session';
import { CinemaSessionsViewDto } from './dto/cinema-sessions-view.dto';
import { CinemaViewDto } from './dto/cinema-view.dto';
import { Cinema } from '../database/entity/cinema';
import { SessionViewDto } from './dto/session-view.dto';

@Injectable()
export class MovieFilterService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private movieRepository: MovieRepository,
    private sessionRepository: SessionRepository,
  ) {
  }

  async findMoviesByFilterAsync(movieFilterQuery: MovieFilterQueryDto): Promise<MovieViewDto[]> {
    let moviesQuery = this.movieRepository.getAll();

    if (movieFilterQuery && movieFilterQuery?.movie) {
      moviesQuery = moviesQuery
        .where(x => x.name)
        .contains(movieFilterQuery.movie, { matchCase: false });
    }

    const movies = await moviesQuery
      .include(x => x.genres)
      .include(x => x.countries);
    return this.mapper.mapArray(movies, Movie, MovieViewDto);

  }

  async findMovieWithSessionsAsync(id: string): Promise<MovieDetailsViewDto> {
    const movie: Movie = await this.movieRepository.getById(id)
      .include(x => x.genres)
      .include(x => x.countries);
    if (!movie) {
      throw new NotFoundException('Movie is not exist');
    }
    const sessions: Session[] = await this.sessionRepository
      .getAll()
      .where(x => x.movie)
      .equal(id)
      .where(x => x.startDate).greaterThanOrEqual(new Date())
      .orderBy(x => x.startDate)
      .include(x => x.sessionSeats)
      .include(x => x.hall)
      .thenInclude(x => x.cinema)
      .thenInclude(x => x.address);

    if (sessions.length <= 0) {
      return null;
    }

    const movieDetails = this.mapper.map(movie, Movie, MovieDetailsViewDto);

    const cinemaSessions: CinemaSessionsViewDto[] = [];

    for (const session of sessions) {
      const cinemaExist = cinemaSessions.find(x => x?.cinema?.id == session.hall.cinema.id);
      if (!cinemaExist) {
        const cinemaSession = new CinemaSessionsViewDto();
        cinemaSession.cinema = this.mapper.map(session.hall.cinema, Cinema, CinemaViewDto);
        const sessionsCinema = sessions.filter(x => x.hall.cinema.id == cinemaSession.cinema.id);
        cinemaSession.sessions = this.mapper.mapArray(sessionsCinema, Session, SessionViewDto);
        cinemaSessions.push(cinemaSession);
      }
    }

    movieDetails.cinemaSessions = cinemaSessions;

    return movieDetails;
  }

}
