import { Injectable } from '@nestjs/common';
import { MovieRepository } from '../database/repository/movie.repository';

@Injectable()
export class ImageUploadService {
  constructor(private movieRepository: MovieRepository) {}

  async findAll(): Promise<string[]> {
    const movies = await this.movieRepository
      .getAll()
      .orderByDescending((x) => x.popularity)
      .include((x) => x.sessions)
      .join((x) => x.sessions)
      .where((x) => x.deleted)
      .isFalse()
      .and((x) => x.startDate)
      .greaterThanOrEqual(new Date());

    if (!movies) {
      return [];
    }

    return movies?.map((x) => x.posterURL);
  }
}
