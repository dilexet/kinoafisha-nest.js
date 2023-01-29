import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CinemaViewDto } from './dto/cinema-view.dto';
import { CinemaRepository } from '../database/repository/cinema.repository';
import { Cinema } from '../database/entity/cinema';

@Injectable()
export class CinemasService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private cinemaRepository: CinemaRepository,
  ) {
  }

  async findAllAsync(): Promise<CinemaViewDto[]> {
    const cinemas = await this.cinemaRepository.getAll();
    return this.mapper.mapArray(cinemas, Cinema, CinemaViewDto);
  }
}
