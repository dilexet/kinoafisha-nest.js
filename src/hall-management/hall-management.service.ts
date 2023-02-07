import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HallDto } from './dto/hall.dto';
import { Hall } from '../database/entity/hall';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { HallViewDto } from './dto/hall-view.dto';
import { Row } from '../database/entity/row';
import { SeatTypePriceDto } from './dto/seat-type-price.dto';
import { HallViewDetailsDto } from './dto/hall-view-details.dto';
import { CinemaRepository } from '../database/repository/cinema.repository';
import { HallRepository } from '../database/repository/hall.repository';
import { RowRepository } from '../database/repository/row.repository';
import { SeatTypeRepository } from '../database/repository/seat-type.repository';

@Injectable()
export class HallManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cinemaRepository: CinemaRepository,
    private readonly hallRepository: HallRepository,
    private readonly seatTypeRepository: SeatTypeRepository,
    private readonly rowRepository: RowRepository,
  ) {
  }

  async create(hallDto: HallDto): Promise<HallViewDto> {
    const cinemaExist = await this.cinemaRepository
      .getById(hallDto.cinemaId)
      .include(x => x.halls);

    if (!cinemaExist) {
      throw new BadRequestException('Cinema is not exist');
    }
    if (cinemaExist?.halls?.find(hall => hall.name === hallDto.name && hall.deleted === false)) {
      throw new BadRequestException('Hall with this name is exist');

    }
    const hall = this.mapper.map(hallDto, HallDto, Hall);

    hall.rows = await this.setSeatTypes(hall.rows, hallDto.seatTypePrices);
    hall.cinema = cinemaExist;
    const hallCreated = await this.hallRepository.create(hall);

    if (!hallCreated) {
      throw new InternalServerErrorException('Error while creating hall');
    }

    return this.mapper.map(hallCreated, Hall, HallViewDto);
  }

  async update(id: string, hallDto: HallDto): Promise<HallViewDto> {
    const cinemaExist = await this.cinemaRepository
      .getById(hallDto.cinemaId)
      .include(x => x.halls);

    if (!cinemaExist) {
      throw new BadRequestException('Cinema is not exist');
    }
    if (cinemaExist?.halls?.find(hall => hall.name == hallDto.name &&
      hall.id != id &&
      hall.deleted === false)) {
      throw new BadRequestException('Hall with this name is exist');
    }

    const hallExist = await this.hallRepository.getById(id).include(x => x.rows);

    if (!hallExist) {
      throw new BadRequestException('Hall is not exist');
    }

    await this.rowRepository.delete(hallExist.rows);

    const hall = this.mapper.map(hallDto, HallDto, Hall);

    hall.rows = await this.setSeatTypes(hall.rows, hallDto.seatTypePrices);
    hall.id = id;
    hall.cinema = cinemaExist;
    const hallUpdating = await this.hallRepository.update(hall);

    if (!hallUpdating) {
      throw new InternalServerErrorException('Error while updating hall');
    }

    return this.mapper.map(hallUpdating, Hall, HallViewDto);
  }

  async remove(id: string): Promise<string> {
    const hall = await this.hallRepository
      .getById(id)
      .include(x => x.rows)
      .thenInclude(x => x.seats)
      .include(x => x.sessions);
    try {
      hall.deleted = true;
      hall.rows = hall.rows.map(row => ({
        ...row,
        deleted: true,
        seats: row.seats.map(seat => ({ ...seat, deleted: true })),
      }));
      hall.sessions = hall.sessions.map(session => ({ ...session, deleted: true }));
      await this.hallRepository.update(hall);
      return id;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Error while removing hall');
    }
  }

  async findAll(name: string): Promise<HallViewDto[]> {
    const hallsQuery = this.hallRepository
      .getAll()
      .include(x => x.rows)
      .thenInclude(x => x.seats)
      .include(x => x.cinema);
    const halls = name
      ? await hallsQuery
        .where(x => x.name)
        .contains(name, { matchCase: false })
      : await hallsQuery;

    return this.mapper.mapArray(halls, Hall, HallViewDto);
  }

  async findOne(id: string): Promise<HallViewDetailsDto> {
    const hall = await this.hallRepository
      .getById(id)
      .include(x => x.cinema)
      .include(x => x.rows)
      .thenBy(x => x.numberRow)
      .thenInclude(x => x.seats)
      .thenBy(x => x.numberSeat)
      .thenInclude(x => x.seatType);

    if (!hall) {
      throw new NotFoundException('Hall is not exist');
    }

    return this.mapper.map(hall, Hall, HallViewDetailsDto);
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
        seat.seatType = await this.seatTypeRepository.getById(seat.seatType.id);
      }
    }

    return rows;
  }

  private hasDuplicates(arr: any[]) {
    return new Set(arr).size !== arr.length;
  }
}
