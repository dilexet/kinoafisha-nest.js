import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Country } from '../entity/country';

@Injectable()
export class CountryRepository extends LinqRepository<Country> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Country);
  }

  getById(id: number | string): IQuery<Country, Country> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Country, Country> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Country, Country[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}