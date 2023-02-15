import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';

@ApiBearerAuth()
@hasRole(RoleEnum.Admin)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.rolesService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }
}
