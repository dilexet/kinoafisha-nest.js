import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {
  }

  @ApiQuery({
    name: 'countryName',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Res() res: Response, @Query('countryName') countryName?: string) {
    const result = await this.countriesService.findAllAsync(countryName);
    return res.status(HttpStatus.OK).json(result);
  }
}
