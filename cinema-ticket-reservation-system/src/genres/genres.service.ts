import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../database/entity/genre';
import { GenreViewDto } from './dto/genre-view.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Genre) private genreRepository: Repository<Genre>,
  ) {
  }

  async findAllAsync(): Promise<GenreViewDto[]> {
    const genres = await this.genreRepository.find();
    return this.mapper.mapArray(genres, Genre, GenreViewDto);
  }
}
