import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Movie } from '../database/entity/movie';
import { MovieDto } from './dto/movie.dto';
import { Genre } from '../database/entity/genre';
import { Country } from '../database/entity/country';
import { MovieViewDto } from './dto/movie-view.dto';
import { CountryRepository } from '../database/repository/country.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { GenreRepository } from '../database/repository/genre.repository';

@Injectable()
export class MovieManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private movieRepository: MovieRepository,
    private genreRepository: GenreRepository,
    private countryRepository: CountryRepository,
  ) {
  }

  async createAsync(movieDto: MovieDto): Promise<MovieViewDto> {
    const movieExist = await this.movieRepository
      .getOne()
      .where(x => x.name)
      .equal(movieDto.name);
    if (movieExist) {
      throw new BadRequestException('Movie with this name is exist');
    }

    const movie: Movie = this.mapper.map(movieDto, MovieDto, Movie);
    movie.genres = await this.createGenresAsync(movieDto.genres);
    movie.countries = await this.createCountriesAsync(movieDto.countries);
    const movieCreated = await this.movieRepository.create(movie);
    if (!movieCreated) {
      throw new InternalServerErrorException('Error while creating movie');
    }

    return this.mapper.map(movieCreated, Movie, MovieViewDto);
  }


  async updateAsync(id: string, movieDto: MovieDto): Promise<MovieViewDto> {
    const movieNameExist = await this.movieRepository
      .getOne()
      .where(x => x.name)
      .equal(movieDto.name);
    if (movieNameExist && movieNameExist.id != id) {
      throw new BadRequestException('Movie with this name is exist');
    }

    const movieExist = await this.movieRepository.getById(id);
    if (!movieExist) {
      throw new BadRequestException('Movie is now exist');
    }

    const movie: Movie = this.mapper.map(movieDto, MovieDto, Movie);
    movie.id = id;
    movie.genres = await this.createGenresAsync(movieDto.genres);
    movie.countries = await this.createCountriesAsync(movieDto.countries);
    const movieUpdated = await this.movieRepository.update(movie);
    if (!movieUpdated) {
      throw new InternalServerErrorException('Error while updating movie');
    }

    return this.mapper.map(movieUpdated, Movie, MovieViewDto);
  }

  async removeAsync(id: string): Promise<string> {
    try {
      await this.movieRepository.delete(id);
      return id;
    } catch (err) {
      throw new BadRequestException('Movie is not exist');
    }
  }

  async findAllAsync(name: string): Promise<MovieViewDto[]> {
    const moviesQuery = this.movieRepository
      .getAll()
      .include(x => x.genres)
      .include(x => x.countries);
    const movies = name
      ? await moviesQuery
        .where(x => x.name)
        .contains(name, { matchCase: false })
      : await moviesQuery;


    return this.mapper.mapArray(movies, Movie, MovieViewDto);
  }

  async findOneByIdAsync(id: string): Promise<MovieViewDto> {
    const movie = await this.movieRepository
      .getById(id)
      .include(x => x.genres)
      .include(x => x.countries);
    if (!movie) {
      throw new NotFoundException('Movie is not exist');
    }

    return this.mapper.map(movie, Movie, MovieViewDto);
  }

  private async createGenresAsync(genreIds: string[]): Promise<Genre[]> {
    const genresArray: Genre[] = [];
    for (const id of genreIds) {
      const genreExist = await this.genreRepository.getById(id);
      if (!genreExist) {
        throw new BadRequestException('Genre is not exist');
      }
      genresArray.push(genreExist);
    }
    return genresArray;
  }

  private async createCountriesAsync(countryNames: string[]): Promise<Country[]> {
    const countryArray: Country[] = [];

    for (const name of countryNames) {
      const countryExist = await this.countryRepository
        .getOne()
        .where(x => x.name)
        .equal(name, { matchCase: false });
      if (!countryExist) {
        const country = new Country();
        country.name = name;
        const newCountry = await this.countryRepository.create(country);
        countryArray.push(newCountry);
      } else {
        countryArray.push(countryExist);
      }
    }
    return countryArray;
  }
}