import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesMapperProfile } from './mapper/countries.mapper-profile';
import { Country } from '../database/entity/country';
import { CountryRepository } from '../database/repository/country.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],
  providers: [CountriesMapperProfile, CountriesService, CountryRepository],
})
export class CountriesModule {
}
