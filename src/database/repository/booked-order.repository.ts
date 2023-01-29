import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { BookedOrder } from '../entity/booked-order';

@Injectable()
export class BookedOrderRepository extends LinqRepository<BookedOrder> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, BookedOrder);
  }
}