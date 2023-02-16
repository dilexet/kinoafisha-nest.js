import { Injectable } from '@nestjs/common';
import { MovieRepository } from '../../database/repository/movie.repository';
import { MoviePopularityMaxValue } from '../constants/movie-popularity';

@Injectable()
export class MoviePopularityService {
  constructor(private movieRepository: MovieRepository) {}

  async addPopularityMovie(movieId: string, popularityValue: number) {
    const movie = await this.movieRepository.getById(movieId);

    if (!movie) {
      return;
    }

    if (movie?.sessions?.length <= 0) {
      return;
    }

    if (movie?.popularity >= MoviePopularityMaxValue) {
      return;
    }

    movie.popularity += popularityValue;

    await this.movieRepository.update(movie);
  }
}
