import { Controller, Get, Body, Put, Param, Res, HttpStatus } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userProfileService.findOneAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Put(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() userProfile: UpdateUserProfileDto) {
    const result = await this.userProfileService.updateAsync(id, userProfile);
    return res.status(HttpStatus.OK).json(result);
  }
}
