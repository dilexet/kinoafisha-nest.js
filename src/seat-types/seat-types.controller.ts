import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { SeatTypesService } from './seat-types.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Seat types')
@Controller('seat-types')
export class SeatTypesController {
  constructor(private readonly seatTypesService: SeatTypesService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.seatTypesService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }
}
