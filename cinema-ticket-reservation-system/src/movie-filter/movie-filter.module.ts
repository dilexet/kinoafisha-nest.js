import { Module } from '@nestjs/common';
import { MovieFilterService } from './movie-filter.service';
import { MovieFilterController } from './movie-filter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/entity/movie';
import { Session } from '../database/entity/session';
import { MovieRepository } from '../database/repository/movie.repository';
import { MovieFilterMapperProfile } from './mapper/movie-filter.mapper-profile';
import { SessionRepository } from '../database/repository/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Session])],
  controllers: [MovieFilterController],
  providers: [MovieFilterMapperProfile, MovieFilterService, MovieRepository, SessionRepository],
})
export class MovieFilterModule {
}
