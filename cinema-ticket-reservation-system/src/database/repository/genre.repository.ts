import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { Genre } from '../entity/genre';

@Injectable()
export class GenreRepository extends LinqRepository<Genre> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Genre);
  }
}