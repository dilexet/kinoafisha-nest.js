import { Controller, Get, Post, Body, Param, Delete, Put, Res, HttpStatus, Patch } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserDto } from './dto/user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserCreateDto } from './dto/user-create.dto';
import { LockStatusDto } from './dto/lock-status.dto';

@ApiTags('User management')
@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {
  }

  @Post()
  @ApiBody({
    type: UserCreateDto,
  })
  async create(@Res() res: Response, @Body() userDto: UserCreateDto) {
    const result = await this.userManagementService.create(userDto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put(':id')
  @ApiBody({
    type: UserDto,
  })
  async update(@Res() res: Response, @Param('id') id: string, @Body() userDto: UserDto) {
    const result = await this.userManagementService.update(id, userDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Patch(':id')
  @ApiBody({
    type: LockStatusDto,
  })
  async changeLockStatus(@Res() res: Response, @Param('id') id: string, @Body() lookStatus: LockStatusDto) {
    const result = await this.userManagementService.changeLockStatus(id, lookStatus.lockStatus);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userManagementService.remove(id);
    return res.status(HttpStatus.OK).json(result);

  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.userManagementService.findAll();
    return res.status(HttpStatus.OK).json(result);

  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
