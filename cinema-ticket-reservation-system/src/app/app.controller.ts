import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @ApiBearerAuth()
  @hasRole(RoleEnum.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('test')
  async test(@Req() req, @Res() res: Response) {
    return res.status(200).json('success');
  }

  @Get()
  getHello(@Res() res: Response) {
    res.status(HttpStatus.OK).json({ message: this.appService.getHello() });
  }
}
