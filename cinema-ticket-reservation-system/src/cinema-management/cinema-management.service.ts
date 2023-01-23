import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CinemaDto } from './dto/cinema.dto';
import { CinemaViewDto } from './dto/cinema-view.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from '../database/entity/cinema';
import { Repository } from 'typeorm';
import { Address } from '../database/entity/address';

@Injectable()
export class CinemaManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Cinema) private readonly cinemaRepository: Repository<Cinema>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
  ) {
  }

  async createAsync(cinemaDto: CinemaDto): Promise<CinemaViewDto> {
    const cinemaExist = await this.cinemaRepository.findOneBy({ name: cinemaDto.name });
    if (cinemaExist) {
      throw new BadRequestException('Cinema with this name is exist');
    }

    const cinema: Cinema = this.mapper.map(cinemaDto, CinemaDto, Cinema);
    const cinemaCreated = await this.cinemaRepository.save(cinema);
    if (!cinemaCreated) {
      throw new InternalServerErrorException('Error while creating cinema');
    }

    return this.mapper.map(cinemaCreated, Cinema, CinemaViewDto);
  }

  async updateAsync(id: string, cinemaDto: CinemaDto): Promise<CinemaViewDto> {
    const cinemaNameExist = await this.cinemaRepository.findOneBy({ name: cinemaDto.name });
    if (cinemaNameExist && cinemaNameExist.id != id) {
      throw new BadRequestException('Cinema with this name is exist');
    }

    const cinemaExist = await this.cinemaRepository.findOneBy({ id: id });
    if (!cinemaExist) {
      throw new BadRequestException('Cinema is not exist');
    }
    const cinema: Cinema = this.mapper.map(cinemaDto, CinemaDto, Cinema);
    cinema.id = id;
    cinema.address.id = cinemaExist.address.id;
    const cinemaUpdates = await this.cinemaRepository.save(cinema);
    if (!cinemaUpdates) {
      throw new InternalServerErrorException('Error while updating cinema');
    }

    return this.mapper.map(cinemaUpdates, Cinema, CinemaViewDto);
  }

  async removeAsync(id: string): Promise<string> {
    try {
      const cinemaExist = await this.cinemaRepository.findOneBy({ id: id });
      await this.cinemaRepository.delete(id);
      await this.addressRepository.delete(cinemaExist.address.id);
      return id;
    } catch (err) {
      throw new BadRequestException('Cinema is not exist');
    }
  }

  async findAllAsync(): Promise<CinemaViewDto[]> {
    const cinemas = await this.cinemaRepository.find(
      { relations: { address: true } });
    return this.mapper.mapArray(cinemas, Cinema, CinemaViewDto);
  }

  async findOneAsync(id: string): Promise<CinemaViewDto> {
    const cinema = await this.cinemaRepository.findOne(
      {
        where: { id: id },
        relations: { address: true },
      });
    if (!cinema) {
      throw new NotFoundException('Cinema is not exist');
    }

    return this.mapper.map(cinema, Cinema, CinemaViewDto);
  }
}
