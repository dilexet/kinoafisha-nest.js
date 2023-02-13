import { Controller, Post, Res, UploadedFile, HttpStatus, BadRequestException, Get, UseGuards } from '@nestjs/common';
import { ApiFile } from './decorators/api-file.decorator';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ImageUploadService } from './image-upload.service';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';

@ApiTags('Image upload')
@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {
  }

  @ApiBearerAuth()
  @hasRole(RoleEnum.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @ApiFile()
  uploadFile(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is null');
    }
    return res.status(HttpStatus.CREATED).json(file.filename);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.imageUploadService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }
}
