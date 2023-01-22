import { Injectable } from '@nestjs/common';
import { HallDto } from './dto/hall.dto';

@Injectable()
export class HallManagementService {
  async create(hallDto: HallDto): Promise<HallDto> {
    return 'This action adds a new hallManagement';
  }

  async update(id: string, hallDto: HallDto): Promise<HallDto> {
    return `This action updates a #${id} hallManagement`;
  }

  async remove(id: string): Promise<string> {
    return `This action removes a #${id} hallManagement`;
  }

  async findAll(): Promise<HallDto[]> {
    return [`This action returns all hallManagement`];
  }

  async findOne(id: string): Promise<HallDto> {
    return `This action returns a #${id} hallManagement`;
  }
}
