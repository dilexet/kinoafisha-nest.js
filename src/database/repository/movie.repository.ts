import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Movie } from '../entity/movie';

@Injectable()
export class MovieRepository extends LinqRepository<Movie> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Movie);
  }

  getById(id: number | string): IQuery<Movie, Movie> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Movie, Movie> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Movie, Movie[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}