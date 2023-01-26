import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, Res } from '@nestjs/common';
import { HallManagementService } from './hall-management.service';
import { HallDto } from './dto/hall.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Hall management')
@Controller('hall-management')
export class HallManagementController {
  constructor(private readonly hallManagementService: HallManagementService) {
  }

  @Post()
  @ApiBody({
    type: HallDto,
  })
  async create(@Res() res: Response, @Body() hallDto: HallDto) {
    const result = await this.hallManagementService.create(hallDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: HallDto,
  })
  async update(@Res() res: Response, @Param('id') id: string, @Body() hallDto: HallDto) {
    const result = await this.hallManagementService.update(id, hallDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.hallManagementService.remove(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.hallManagementService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.hallManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}