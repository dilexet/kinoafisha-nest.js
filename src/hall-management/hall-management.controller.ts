import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HallManagementService } from './hall-management.service';
import { HallDto } from './dto/hall.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';

@ApiBearerAuth()
@hasRole(RoleEnum.Admin)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Hall management')
@Controller('hall-management')
export class HallManagementController {
  constructor(private readonly hallManagementService: HallManagementService) {}

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
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() hallDto: HallDto,
  ) {
    const result = await this.hallManagementService.update(id, hallDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.hallManagementService.remove(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Res() res: Response, @Query('name') name?: string) {
    const result = await this.hallManagementService.findAll(name);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.hallManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
