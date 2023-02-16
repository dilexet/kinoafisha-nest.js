import { Module } from '@nestjs/common';
import { ImageUploadController } from './image-upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/entity/movie';
import { MovieRepository } from '../database/repository/movie.repository';
import { ImageUploadService } from './image-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [ImageUploadController],
  providers: [MovieRepository, ImageUploadService],
})
export class ImageUploadModule {}
