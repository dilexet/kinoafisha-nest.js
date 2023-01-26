import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { HallsService } from './halls.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {
  }

  @ApiParam({
    name: 'cinemaId',
    type: String,
  })
  @Get(':cinemaId')
  async findByCinema(@Res() res: Response, @Param('cinemaId') cinemaId: string) {
    const result = await this.hallsService.findByCinemaAsync(cinemaId);
    return res.status(HttpStatus.OK).json(result);
  }
}
