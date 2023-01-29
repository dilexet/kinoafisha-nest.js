import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.genresService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }
}
