import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { BookedOrder } from '../entity/booked-order';

@Injectable()
export class BookedOrderRepository extends LinqRepository<BookedOrder> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, BookedOrder);
  }

  getById(id: number | string): IQuery<BookedOrder, BookedOrder> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<BookedOrder, BookedOrder> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<BookedOrder, BookedOrder[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}