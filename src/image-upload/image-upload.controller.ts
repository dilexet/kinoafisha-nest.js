import { Controller, Post, Res, UploadedFile, HttpStatus, BadRequestException, Get } from '@nestjs/common';
import { ApiFile } from './decorators/api-file.decorator';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ImageUploadService } from './image-upload.service';

@ApiTags('Image upload')
@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {
  }

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
