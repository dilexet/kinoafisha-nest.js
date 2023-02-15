import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionManagementService } from './session-management.service';
import { SessionCreateDto } from './dto/session-create.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SessionUpdateDto } from './dto/session-update.dto';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';

@ApiBearerAuth()
@hasRole(RoleEnum.Admin)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Session management')
@Controller('session-management')
export class SessionManagementController {
  constructor(
    private readonly sessionManagementService: SessionManagementService,
  ) {}

  @Post()
  @ApiBody({
    type: SessionCreateDto,
  })
  async create(@Res() res: Response, @Body() sessionDto: SessionCreateDto) {
    const result = await this.sessionManagementService.create(sessionDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: SessionUpdateDto,
  })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() sessionDto: SessionUpdateDto,
  ) {
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

  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Res() res: Response, @Query('name') name?: string) {
    const result = await this.sessionManagementService.findAll(name);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.sessionManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
