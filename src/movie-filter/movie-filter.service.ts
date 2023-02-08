import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieFilterQueryDto } from './dto/movie-filter-query.dto';
import { MovieViewDto } from './dto/movie-view.dto';
import { MovieDetailsViewDto } from './dto/movie-details-view.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { MovieRepository } from '../database/repository/movie.repository';
import { Movie } from '../database/entity/movie';
import { Session } from '../database/entity/session';
import { CinemaSessionsViewDto } from './dto/cinema-sessions-view.dto';
import { CinemaViewDto } from './dto/cinema-view.dto';
import { Cinema } from '../database/entity/cinema';
import { SessionViewDto } from './dto/session-view.dto';
import { MoviePopularityService } from '../shared/utils/movie-popularity-service';
import { MovieLimit, MoviePopularityByViews } from '../shared/constants/movie-popularity';
import { MovieFilterAfishaQueryDto } from './dto/movie-filter-afisha-query.dto';

@Injectable()
export class MovieFilterService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private movieRepository: MovieRepository,
    private moviePopularityService: MoviePopularityService,
  ) {
  }

  async findMoviesAsync(movieFilterQuery: MovieFilterQueryDto): Promise<MovieViewDto[]> {
    if (JSON.parse(String(movieFilterQuery?.onlyFuture ?? 'false')) === true) {
      const movies = await this.movieRepository
        .getAll()
        .include(x => x.genres)
        .include(x => x.countries)
        .include(x => x.sessions);


      return this.mapper.mapArray(movies.filter(x => x?.sessions?.length <= 0), Movie, MovieViewDto);
    }

    if (JSON.parse(String(movieFilterQuery?.onlyPopular ?? 'false')) === true) {
      const movies = await this.movieRepository
        .getAll()
        .where(x => x.popularity)
        .greaterThan(0)
        .orderByDescending(x => x.popularity)
        .include(x => x.genres)
        .include(x => x.countries)
        .include(x => x.sessions)
        .join(x => x.sessions)
        .where(x => x.deleted)
        .isFalse()
        .and(x => x.startDate)
        .greaterThanOrEqual(new Date())
        .take(MovieLimit);

      return this.mapper.mapArray(movies, Movie, MovieViewDto);
    }

    const movies = await this.movieRepository.getAll()
      .include(x => x.genres)
      .include(x => x.countries);
    return this.mapper.mapArray(movies, Movie, MovieViewDto);
  }

  async findMoviesByFilterAsync(movieFilterQuery: MovieFilterAfishaQueryDto): Promise<MovieViewDto[]> {
    let moviesQuery = this.movieRepository.getAll();

    if (movieFilterQuery && movieFilterQuery?.movie) {
      moviesQuery = moviesQuery
        .where(x => x.name)
        .contains(movieFilterQuery.movie, { matchCase: false });
    }

    movieFilterQuery.limit = +movieFilterQuery?.limit <= 0 ? 1 : +movieFilterQuery?.limit;
    movieFilterQuery.page = +movieFilterQuery?.page <= 0 ? 1 : +movieFilterQuery?.page;
    const itemsToSkip = +((movieFilterQuery.page - 1) * movieFilterQuery.limit);
    const movies = await moviesQuery
      .orderByDescending(x => x.popularity)
      .include(x => x.genres)
      .include(x => x.countries)
      .skip(itemsToSkip)
      .take(movieFilterQuery.limit);
    return this.mapper.mapArray(movies, Movie, MovieViewDto);
  }

  async findMovieWithSessionsAsync(id: string): Promise<MovieDetailsViewDto> {
    const movieExist: Movie = await this.movieRepository
      .getById(id)
      .include(x => x.genres)
      .include(x => x.countries);

    if (!movieExist) {
      throw new NotFoundException('Movie is not exist');
    }

    const movie: Movie = await this.movieRepository
      .getById(id)
      .include(x => x.sessions)
      .join(x => x.sessions)
      .where(x => x.deleted)
      .isFalse()
      .and(x => x.startDate)
      .greaterThanOrEqual(new Date())
      .orderBy(x => x.startDate)
      .include(x => x.sessions)
      .thenInclude(x => x.sessionSeats)
      .include(x => x.sessions)
      .thenInclude(x => x.hall)
      .thenInclude(x => x.cinema)
      .thenInclude(x => x.address);

    if (!movie?.sessions) {
      return this.mapper.map(movieExist, Movie, MovieDetailsViewDto);
    }

    const movieDetails = this.mapper.map(movieExist, Movie, MovieDetailsViewDto);

    const cinemaSessions: CinemaSessionsViewDto[] = [];

    for (const session of movie?.sessions) {
      const cinemaExist = cinemaSessions.find(x => x?.cinema?.id == session.hall.cinema.id);
      if (!cinemaExist) {
        const cinemaSession = new CinemaSessionsViewDto();
        cinemaSession.cinema = this.mapper.map(session.hall.cinema, Cinema, CinemaViewDto);
        const sessionsCinema = movie?.sessions.filter(x => x.hall.cinema.id == cinemaSession.cinema.id);
        cinemaSession.sessions = this.mapper.mapArray(sessionsCinema, Session, SessionViewDto);
        cinemaSessions.push(cinemaSession);
      }
    }

    await this.moviePopularityService.addPopularityMovie(id, MoviePopularityByViews);

    movieDetails.cinemaSessions = cinemaSessions;

    return movieDetails;
  }

}
