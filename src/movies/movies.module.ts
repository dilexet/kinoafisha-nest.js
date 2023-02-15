import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CinemasController } from './cinemas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesMapperProfile } from './mapper/movies.mapper-profile';
import { Movie } from '../database/entity/movie';
import { MovieRepository } from '../database/repository/movie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [CinemasController],
  providers: [MoviesMapperProfile, MoviesService, MovieRepository],
})
export class MoviesModule {}
