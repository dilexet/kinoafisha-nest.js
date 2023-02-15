import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { MovieViewDto } from './dto/movie-view.dto';
import { Movie } from '../database/entity/movie';
import { MovieRepository } from '../database/repository/movie.repository';

@Injectable()
export class MoviesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private movieRepository: MovieRepository,
  ) {}

  async findAllAsync(): Promise<MovieViewDto[]> {
    const movies = await this.movieRepository.getAll();
    return this.mapper.mapArray(movies, Movie, MovieViewDto);
  }
}
