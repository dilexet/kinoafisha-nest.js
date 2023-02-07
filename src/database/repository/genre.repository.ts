import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Genre } from '../entity/genre';

@Injectable()
export class GenreRepository extends LinqRepository<Genre> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Genre);
  }

  getById(id: number | string): IQuery<Genre, Genre> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Genre, Genre> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Genre, Genre[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}