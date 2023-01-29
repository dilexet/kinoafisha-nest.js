import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.cinemasService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }
}
