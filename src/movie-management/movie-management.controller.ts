import {
  Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MovieManagementService } from './movie-management.service';
import { Response } from 'express';
import { MovieDto } from './dto/movie.dto';

@ApiTags('Movie management')
@Controller('movie-management')
export class MovieManagementController {
  constructor(
    private movieManagementService: MovieManagementService,
  ) {
  }

  @Post()
  @ApiBody({
    type: MovieDto,
  })
  async create(@Res() res: Response, @Body() movieDto: MovieDto) {
    const result = await this.movieManagementService.createAsync(movieDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: MovieDto,
  })
  async update(@Res() res: Response, @Param('id') id: string, @Body() movieDto: MovieDto) {
    const result = await this.movieManagementService.updateAsync(id, movieDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.movieManagementService.removeAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Res() res: Response, @Query('name') name?: string) {
    const result = await this.movieManagementService.findAllAsync(name);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.movieManagementService.findOneByIdAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }
}