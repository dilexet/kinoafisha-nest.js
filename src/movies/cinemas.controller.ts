import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Movies')
@Controller('movies')
export class CinemasController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.moviesService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }
}
