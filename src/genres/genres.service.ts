import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Genre } from '../database/entity/genre';
import { GenreViewDto } from './dto/genre-view.dto';
import { GenreRepository } from '../database/repository/genre.repository';

@Injectable()
export class GenresService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private genreRepository: GenreRepository,
  ) {}

  async findAllAsync(): Promise<GenreViewDto[]> {
    const genres = await this.genreRepository.getAll();
    return this.mapper.mapArray(genres, Genre, GenreViewDto);
  }
}
