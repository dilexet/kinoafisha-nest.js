import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { SeatType } from '../entity/seat-type';

@Injectable()
export class SeatTypeRepository extends LinqRepository<SeatType> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, SeatType);
  }

  getById(id: number | string): IQuery<SeatType, SeatType> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<SeatType, SeatType> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<SeatType, SeatType[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}