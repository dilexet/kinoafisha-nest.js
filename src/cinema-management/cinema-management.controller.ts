import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Res, Put, Query } from '@nestjs/common';
import { CinemaManagementService } from './cinema-management.service';
import { CinemaDto } from './dto/cinema.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Cinema management')
@Controller('cinema-management')
export class CinemaManagementController {
  constructor(private readonly cinemaManagementService: CinemaManagementService) {
  }

  @Post()
  @ApiBody({
    type: CinemaDto,
  })
  async create(@Res() res: Response, @Body() cinemaDto: CinemaDto) {
    const result = await this.cinemaManagementService.createAsync(cinemaDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: CinemaDto,
  })
  async update(@Res() res: Response, @Param('id') id: string, @Body() cinemaDto: CinemaDto) {
    const result = await this.cinemaManagementService.updateAsync(id, cinemaDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.cinemaManagementService.removeAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Res() res: Response, @Query('name') name?: string) {
    const result = await this.cinemaManagementService.findAllAsync(name);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.cinemaManagementService.findOneAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
