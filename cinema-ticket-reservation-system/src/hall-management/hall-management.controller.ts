import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, Res } from '@nestjs/common';
import { HallManagementService } from './hall-management.service';
import { HallDto } from './dto/hall.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Hall management')
@Controller('hall-management')
export class HallManagementController {
  constructor(private readonly hallManagementService: HallManagementService) {
  }

  @Post()
  @ApiBody({
    type: HallDto,
  })
  async create(@Res() res, @Body() hallDto: HallDto) {
    const result = this.hallManagementService.create(hallDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: HallDto,
  })
  async update(@Res() res, @Param('id') id: string, @Body() hallDto: HallDto) {
    const result = this.hallManagementService.update(id, hallDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  remove(@Res() res, @Param('id') id: string) {
    const result = this.hallManagementService.remove(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get()
  async findAll(@Res() res) {
    const result = this.hallManagementService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res, @Param('id') id: string) {
    const result = this.hallManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
