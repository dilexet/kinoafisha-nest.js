import { Module } from '@nestjs/common';
import { MovieManagementController } from './movie-management.controller';
import { MovieManagementService } from './movie-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../database/entity/movie';
import { Genre } from '../database/entity/genre';
import { Country } from '../database/entity/country';
import { MovieManagementMapperProfile } from './mapper/movie-management.mapper-profile';
import { CountryRepository } from '../database/repository/country.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { GenreRepository } from '../database/repository/genre.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre, Country])],
  controllers: [MovieManagementController],
  providers: [
    CountryRepository,
    MovieRepository,
    GenreRepository,
    MovieManagementMapperProfile,
    MovieManagementService,
  ],
})
export class MovieManagementModule {}
