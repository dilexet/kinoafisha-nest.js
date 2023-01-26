import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { Hall } from '../entity/hall';

@Injectable()
export class HallRepository extends LinqRepository<Hall> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Hall);
  }
}