import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Hall } from '../entity/hall';

@Injectable()
export class HallRepository extends LinqRepository<Hall> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Hall);
  }

  getById(id: number | string): IQuery<Hall, Hall> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Hall, Hall> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Hall, Hall[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}