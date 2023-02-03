import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Row } from '../entity/row';

@Injectable()
export class RowRepository extends LinqRepository<Row> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Row);
  }

  getById(id: number | string): IQuery<Row, Row> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Row, Row> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Row, Row[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}