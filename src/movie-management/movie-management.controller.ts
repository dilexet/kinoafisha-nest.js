import {
  Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MovieManagementService } from './movie-management.service';
import { Response } from 'express';
import { MovieDto } from './dto/movie.dto';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';

@ApiBearerAuth()
@hasRole(RoleEnum.Admin)
@UseGuards(JwtAuthGuard, RoleGuard)
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