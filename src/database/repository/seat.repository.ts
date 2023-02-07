import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Seat } from '../entity/seat';

@Injectable()
export class SeatRepository extends LinqRepository<Seat> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Seat);
  }

  getById(id: number | string): IQuery<Seat, Seat> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Seat, Seat> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Seat, Seat[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}