import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SeatTypeViewDto } from './dto/seat-type-view.dto';
import { SeatTypeRepository } from '../database/repository/seat-type.repository';
import { SeatType } from '../database/entity/seat-type';

@Injectable()
export class SeatTypesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private seatTypeRepository: SeatTypeRepository,
  ) {
  }

  async findAllAsync(): Promise<SeatTypeViewDto[]> {
    const seatTypes = await this.seatTypeRepository.getAll();
    return this.mapper.mapArray(seatTypes, SeatType, SeatTypeViewDto);
  }
}
