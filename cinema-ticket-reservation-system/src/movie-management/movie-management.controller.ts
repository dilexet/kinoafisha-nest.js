import {
  Body, Controller, Delete, Get, HttpStatus, Param, Post, Put,
  Res, UploadedFile,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MovieManagementService } from './movie-management.service';
import { Response } from 'express';
import { MovieDto } from './dto/movie.dto';
import { ApiFile } from '../shared/decorators/api-file.decorator';

@ApiTags('Movie management')
@Controller('movie-management')
export class MovieManagementController {
  constructor(
    private movieManagementService: MovieManagementService,
  ) {
  }

  @Post('upload')
  @ApiFile()
  uploadFile(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    return res.status(HttpStatus.CREATED).json(file.filename);
  }

  @Post()
  @ApiBody({
    type: MovieDto,
    description: 'Movie create',
  })
  async create(@Res() res: Response, @Body() movieDto: MovieDto) {
    const result = await this.movieManagementService.createAsync(movieDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: MovieDto,
    description: 'Movie create',
  })
  async update(@Res() res: Response, @Param('id') id: string, @Body() movieDto: MovieDto) {
    const result = await this.movieManagementService.updateAsync(id, movieDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    const result = await this.movieManagementService.deleteAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.movieManagementService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.movieManagementService.findOneByIdAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }
}