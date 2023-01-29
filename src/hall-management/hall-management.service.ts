import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HallDto } from './dto/hall.dto';
import { Hall } from '../database/entity/hall';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from '../database/entity/cinema';
import { Repository } from 'typeorm';
import { HallViewDto } from './dto/hall-view.dto';
import { SeatType } from '../database/entity/seat-type';
import { Row } from '../database/entity/row';
import { SeatTypePriceDto } from './dto/seat-type-price.dto';

@Injectable()
export class HallManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Cinema) private readonly cinemaRepository: Repository<Cinema>,
    @InjectRepository(Hall) private readonly hallRepository: Repository<Hall>,
    @InjectRepository(Row) private readonly rowRepository: Repository<Row>,
    @InjectRepository(SeatType) private readonly seatTypeRepository: Repository<SeatType>,
  ) {
  }

  async create(hallDto: HallDto): Promise<HallViewDto> {
    const cinemaExist = await this.cinemaRepository.findOne({
      where: { id: hallDto.cinemaId }, relations: {
        halls: true,
      },
    });
    if (!cinemaExist) {
      throw new BadRequestException('Cinema is not exist');
    }
    if (cinemaExist?.halls?.find(hall => hall.name == hallDto.name)) {
      throw new BadRequestException('Hall with this name is exist');

    }
    const hall = this.mapper.map(hallDto, HallDto, Hall);

    hall.rows = await this.setSeatTypes(hall.rows, hallDto.seatTypePrices);
    hall.cinema = cinemaExist;
    const hallCreated = await this.hallRepository.save(hall);

    if (!hallCreated) {
      throw new InternalServerErrorException('Error while creating hall');
    }

    return this.mapper.map(hallCreated, Hall, HallViewDto);
  }

  async update(id: string, hallDto: HallDto): Promise<HallViewDto> {
    const cinemaExist = await this.cinemaRepository.findOne({
      where: { id: hallDto.cinemaId }, relations: {
        halls: true,
      },
    });
    if (!cinemaExist) {
      throw new BadRequestException('Cinema is not exist');
    }
    if (cinemaExist?.halls?.find(hall => hall.name == hallDto.name && hall.id != id)) {
      throw new BadRequestException('Hall with this name is exist');
    }

    const hallExist = await this.hallRepository.delete(id);

    if (!hallExist) {
      throw new BadRequestException('Hall is not exist');
    }
    const hall = this.mapper.map(hallDto, HallDto, Hall);

    hall.rows = await this.setSeatTypes(hall.rows, hallDto.seatTypePrices);
    hall.id = id;
    hall.cinema = cinemaExist;
    const hallUpdating = await this.hallRepository.save(hall);

    if (!hallUpdating) {
      throw new InternalServerErrorException('Error while updating hall');
    }

    return this.mapper.map(hallUpdating, Hall, HallViewDto);
  }

  async remove(id: string): Promise<string> {
    try {
      await this.hallRepository.delete(id);
      return id;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Hall is not exist');
    }
  }

  async findAll(): Promise<HallViewDto[]> {
    const halls = await this.hallRepository.find(
      {
        relations: { rows: true, cinema: true },
      },
    );

    return this.mapper.mapArray(halls, Hall, HallViewDto);
  }

  async findOne(id: string): Promise<HallViewDto> {
    const hall = await this.hallRepository.findOne(
      {
        where: { id: id },
        relations: { rows: true, cinema: true },
      },
    );

    if (!hall) {
      throw new NotFoundException('Hall is not exist');
    }

    return this.mapper.map(hall, Hall, HallViewDto);
  }

  private async setSeatTypes(rows: Row[], seatTypePrices: SeatTypePriceDto[]): Promise<Row[]> {
    if (this.hasDuplicates(seatTypePrices.map(x => x.seatTypeId))) {
      throw new BadRequestException('Found several identical seat type price');
    }

    for (const row of rows) {
      for (const seat of row.seats) {
        const seatTypePriceFound = seatTypePrices.find(type => type.seatTypeId == seat.seatType.id);
        if (!seatTypePriceFound) {
          throw new BadRequestException('Seat type price did not find');
        }
        seat.price = seatTypePriceFound.price;
        seat.seatType = await this.seatTypeRepository.findOneBy({ id: seat.seatType.id });
      }
    }

    return rows;
  }

  private hasDuplicates(arr: any[]) {
    return new Set(arr).size !== arr.length;
  }
}
