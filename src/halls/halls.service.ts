import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { HallViewDto } from './dto/hall-view.dto';
import { Hall } from '../database/entity/hall';
import { CinemaRepository } from '../database/repository/cinema.repository';

@Injectable()
export class HallsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private cinemaRepository: CinemaRepository,
  ) {
  }

  async findByCinemaAsync(cinemaId: string): Promise<HallViewDto[]> {
    if (!cinemaId) {
      throw new BadRequestException('Cinema id is null');
    }
    const cinema = await this.cinemaRepository
      .getById(cinemaId)
      .include(x => x.halls)
      .join(x => x.halls)
      .where(x => x.deleted)
      .isFalse();
    if (!cinema || !cinema?.halls || cinema?.halls?.length <= 0) {
      return [];
    }
    return this.mapper.mapArray(cinema?.halls, Hall, HallViewDto);
  }
}
