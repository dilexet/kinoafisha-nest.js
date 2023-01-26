import { Controller, Post, Res, UploadedFile, HttpStatus } from '@nestjs/common';
import { ApiFile } from './decorators/api-file.decorator';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Image upload')
@Controller('image-upload')
export class ImageUploadController {
  constructor() {
  }

  @Post()
  @ApiFile()
  uploadFile(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    return res.status(HttpStatus.CREATED).json(file.filename);
  }
}
