import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.rolesService.findAllAsync();
    return res.status(HttpStatus.OK).json(result);
  }
}
