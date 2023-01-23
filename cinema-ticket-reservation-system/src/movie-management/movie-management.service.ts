import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../database/entity/movie';
import { MovieDto } from './dto/movie.dto';
import { Genre } from '../database/entity/genre';
import { Country } from '../database/entity/country';
import { MovieViewDto } from './dto/movie-view.dto';

@Injectable()
export class MovieManagementService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Genre) private genreRepository: Repository<Genre>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {
  }

  async createAsync(movieDto: MovieDto): Promise<MovieViewDto> {
    const movieExist = await this.movieRepository.findOneBy({ name: movieDto.name });
    if (movieExist) {
      throw new BadRequestException('Movie with this name is exist');
    }

    const movie: Movie = this.mapper.map(movieDto, MovieDto, Movie);
    movie.genres = await this.createGenresAsync(movieDto.genres);
    movie.countries = await this.createCountriesAsync(movieDto.countries);
    const movieCreated = await this.movieRepository.save(movie);
    if (!movieCreated) {
      throw new InternalServerErrorException('Error while creating movie');
    }

    return this.mapper.map(movieCreated, Movie, MovieViewDto);
  }


  async updateAsync(id: string, movieDto: MovieDto): Promise<MovieViewDto> {
    const movieNameExist = await this.movieRepository.findOneBy({ name: movieDto.name });
    if (movieNameExist && movieNameExist.id != id) {
      throw new BadRequestException('Movie with this name is exist');
    }

    const movieExist = await this.movieRepository.findOneBy({ id: id });
    if (!movieExist) {
      throw new BadRequestException('Movie is now exist');
    }

    const movie: Movie = this.mapper.map(movieDto, MovieDto, Movie);
    movie.id = id;
    movie.genres = await this.createGenresAsync(movieDto.genres);
    movie.countries = await this.createCountriesAsync(movieDto.countries);
    const movieUpdated = await this.movieRepository.save(movie);
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

  async findAllAsync(): Promise<MovieViewDto[]> {
    const movies = await this.movieRepository.find(
      { relations: { genres: true, countries: true } });
    return this.mapper.mapArray(movies, Movie, MovieViewDto);
  }

  async findOneByIdAsync(id: string): Promise<MovieViewDto> {
    const movie = await this.movieRepository.findOne({
      where: { id: id },
      relations: { genres: true, countries: true },
    });
    if (!movie) {
      throw new NotFoundException('Movie is not exist');
    }

    return this.mapper.map(movie, Movie, MovieViewDto);
  }

  private async createGenresAsync(genreIds: string[]): Promise<Genre[]> {
    const genresArray: Genre[] = [];
    for (const id of genreIds) {
      const genreExist = await this.genreRepository.findOneBy({ id: id });
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
      const countryExist = await this.countryRepository.findOneBy({ name: name });
      if (!countryExist) {
        const country: Country = this.countryRepository.create({ name: name });
        const newCountry = await this.countryRepository.save(country);
        countryArray.push(newCountry);
      } else {
        countryArray.push(countryExist);
      }
    }
    return countryArray;
  }
}