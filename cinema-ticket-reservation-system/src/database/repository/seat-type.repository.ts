import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { SeatType } from '../entity/seat-type';

@Injectable()
export class SeatTypeRepository extends LinqRepository<SeatType> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, SeatType);
  }
}