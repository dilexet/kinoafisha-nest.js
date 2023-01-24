import { Injectable } from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../database/entity/session';

@Injectable()
export class SessionManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
  ) {
  }

  async create(sessionDto: SessionDto): Promise<string> {
    return 'This action adds a new sessionManagement';
  }

  async update(id: string, sessionDto: SessionDto): Promise<string> {
    return `This action updates a #${id} sessionManagement`;
  }

  async removeFromBooking(seatId: string): Promise<string> {
    return `This action updates a #${seatId} sessionManagement`;
  }

  async remove(id: string): Promise<string> {
    return `This action removes a #${id} sessionManagement`;
  }

  async findAll(): Promise<string> {
    return `This action returns all sessionManagement`;
  }

  async findOne(id: string): Promise<string> {
    return `This action returns a #${id} sessionManagement`;
  }
}
