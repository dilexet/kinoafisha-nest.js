import { Controller, Get, Post, Body, Param, Delete, Put, Res, HttpStatus, Patch, Query } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserDto } from './dto/user.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserCreateDto } from './dto/user-create.dto';

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
  async changeLockStatus(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userManagementService.changeLockStatus(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userManagementService.remove(id);
    return res.status(HttpStatus.OK).json(result);

  }

  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Res() res: Response, @Query('name') name?: string) {
    const result = await this.userManagementService.findAll(name);
    return res.status(HttpStatus.OK).json(result);

  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userManagementService.findOne(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
