import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CinemaDto } from './dto/cinema.dto';
import { CinemaViewDto } from './dto/cinema-view.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from '../database/entity/cinema';
import { Repository } from 'typeorm';
import { Address } from '../database/entity/address';
import { CinemaRepository } from '../database/repository/cinema.repository';

@Injectable()
export class CinemaManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cinemaRepository: CinemaRepository,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
  ) {
  }

  async createAsync(cinemaDto: CinemaDto): Promise<CinemaViewDto> {
    const cinemaExist = await this.cinemaRepository
      .getOne().where(x => x.name).equal(cinemaDto.name);
    if (cinemaExist) {
      throw new BadRequestException('Cinema with this name is exist');
    }

    const cinema: Cinema = this.mapper.map(cinemaDto, CinemaDto, Cinema);
    const cinemaCreated = await this.cinemaRepository.create(cinema);
    if (!cinemaCreated) {
      throw new InternalServerErrorException('Error while creating cinema');
    }

    return this.mapper.map(cinemaCreated, Cinema, CinemaViewDto);
  }

  async updateAsync(id: string, cinemaDto: CinemaDto): Promise<CinemaViewDto> {
    const cinemaNameExist = await this.cinemaRepository
      .getOne().where(x => x.name).equal(cinemaDto.name);
    if (cinemaNameExist && cinemaNameExist.id != id) {
      throw new BadRequestException('Cinema with this name is exist');
    }

    const cinemaExist = await this.cinemaRepository
      .getById(id)
      .include(x => x.address);
    if (!cinemaExist) {
      throw new BadRequestException('Cinema is not exist');
    }
    const cinema: Cinema = this.mapper.map(cinemaDto, CinemaDto, Cinema);
    cinema.id = id;
    cinema.address.id = cinemaExist.address.id;
    const cinemaUpdated = await this.cinemaRepository.create(cinema);
    if (!cinemaUpdated) {
      throw new InternalServerErrorException('Error while updating cinema');
    }

    return this.mapper.map(cinemaUpdated, Cinema, CinemaViewDto);
  }

  async removeAsync(id: string): Promise<string> {
    try {
      const cinemaExist = await this.cinemaRepository
        .getById(id)
        .include(x => x.address);
      await this.cinemaRepository.delete(id);
      await this.addressRepository.delete(cinemaExist.address.id);
      return id;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Cinema is not exist');
    }
  }

  async findAllAsync(name: string): Promise<CinemaViewDto[]> {
    const cinemasQuery = this.cinemaRepository
      .getAll()
      .include(x => x.address);
    const cinemas = name
      ? await cinemasQuery
        .where(x => x.name)
        .contains(name, { matchCase: false })
      : await cinemasQuery;
    return this.mapper.mapArray(cinemas, Cinema, CinemaViewDto);
  }

  async findOneAsync(id: string): Promise<CinemaViewDto> {
    const cinema = await this.cinemaRepository
      .getById(id)
      .include(x => x.address);
    if (!cinema) {
      throw new NotFoundException('Cinema is not exist');
    }

    return this.mapper.map(cinema, Cinema, CinemaViewDto);
  }
}
