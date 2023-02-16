import { Module } from '@nestjs/common';
import { MovieFilterService } from './movie-filter.service';
import { MovieFilterController } from './movie-filter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/entity/movie';
import { Session } from '../database/entity/session';
import { MovieRepository } from '../database/repository/movie.repository';
import { MovieFilterMapperProfile } from './mapper/movie-filter.mapper-profile';
import { MoviePopularityService } from '../shared/utils/movie-popularity-service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Session])],
  controllers: [MovieFilterController],
  providers: [
    MovieFilterMapperProfile,
    MovieFilterService,
    MovieRepository,
    MoviePopularityService,
  ],
})
export class MovieFilterModule {}
