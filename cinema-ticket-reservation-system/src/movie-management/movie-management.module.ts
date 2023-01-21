import { Module } from '@nestjs/common';
import { MovieManagementController } from './movie-management.controller';
import { MovieManagementService } from './movie-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/entity/movie';
import { Genre } from '../database/entity/genre';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [MovieManagementController],
  providers: [
    MovieManagementService,
  ],
})

export class MovieManagementModule {
}