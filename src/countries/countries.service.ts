import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CountryViewDto } from './dto/country-view.dto';
import { Country } from '../database/entity/country';
import { CountryRepository } from '../database/repository/country.repository';

@Injectable()
export class CountriesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly countryRepository: CountryRepository,
  ) {}

  async findAllAsync(countryName: string): Promise<CountryViewDto[]> {
    const countryQuery = this.countryRepository.getAll();
    const countries = countryName
      ? await countryQuery.where((x) => x.name).contains(countryName)
      : await countryQuery;
    return this.mapper.mapArray(countries, Country, CountryViewDto);
  }
}
