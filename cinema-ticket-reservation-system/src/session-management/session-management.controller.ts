import { Controller, Get, Post, Body, Param, Delete, Put, Res, HttpStatus, Patch } from '@nestjs/common';
import { SessionManagementService } from './session-management.service';
import { SessionDto } from './dto/session.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Session management')
@Controller('session-management')
export class SessionManagementController {
  constructor(private readonly sessionManagementService: SessionManagementService) {
  }

  @Post()
  @ApiBody({
    type: SessionDto,
  })
  async create(@Res() res: Response, @Body() sessionDto: SessionDto) {
    const result = await this.sessionManagementService.create(sessionDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: SessionDto,
  })
  async update(@Res() res: Response, @Param('id') id: string, @Body() sessionDto: SessionDto) {
    const result = await this.sessionManagementService.update(id, sessionDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Patch(':id')
  async removeFromBooking(@Res() res: Response, @Param('id') id: string) {
    const result = await this.sessionManagementService.removeFromBooking(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.sessionManagementService.remove(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.sessionManagementService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.sessionManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
