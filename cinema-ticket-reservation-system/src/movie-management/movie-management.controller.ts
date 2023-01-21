import {
  Body,
  Controller, HttpStatus, Post,
  Res, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MovieManagementService } from './movie-management.service';
import { Response } from 'express';
import { MovieDto } from './dto/movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageDiskStorage, imageFileFilter } from './utils/file-upload.helpers';

@ApiTags('Movie management')
@Controller('movie-management')
export class MovieManagementController {
  constructor(
    private movieManagementService: MovieManagementService,
  ) {
  }

  @Post()
  @ApiBody({
    type: MovieDto,
    description: 'Movie create',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('poster', {
    storage: imageDiskStorage,
    fileFilter: imageFileFilter,
  }))
  async create(@Res() res: Response,
               @Body() movieDto: MovieDto,
               @UploadedFile() poster: Express.Multer.File,
  ) {
    console.log(movieDto);
    console.log(poster);
    const result = await this.movieManagementService.createAsync(movieDto, null);
    return res.status(HttpStatus.OK).json(result);
  }
}