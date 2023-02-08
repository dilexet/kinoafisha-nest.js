import { Controller, Get, Param, Res, HttpStatus, Query } from '@nestjs/common';
import { MovieFilterService } from './movie-filter.service';
import { MovieFilterQueryDto } from './dto/movie-filter-query.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { MovieFilterAfishaQueryDto } from './dto/movie-filter-afisha-query.dto';

@ApiTags('Movie filter')
@Controller('movie-filter')
export class MovieFilterController {
  constructor(private readonly movieFilterService: MovieFilterService) {
  }

  @ApiImplicitQuery({ type: Boolean, name: 'onlyPopular', required: false })
  @ApiImplicitQuery({ type: Boolean, name: 'onlyFuture', required: false })
  @Get()
  async findAll(@Res() res: Response, @Query() movieFilterQuery: MovieFilterQueryDto) {
    const result = await this.movieFilterService.findMoviesAsync(movieFilterQuery);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiImplicitQuery({ type: String, name: 'movie', required: false })
  @ApiImplicitQuery({ type: Number, name: 'page' })
  @ApiImplicitQuery({ type: Number, name: 'limit' })
  @Get('/afisha')
  async findAllByFilters(@Res() res: Response, @Query() movieFilterQuery: MovieFilterAfishaQueryDto) {
    const result = await this.movieFilterService.findMoviesByFilterAsync(movieFilterQuery);
    return res.status(HttpStatus.OK).json(result);
  }


  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.movieFilterService.findMovieWithSessionsAsync(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
