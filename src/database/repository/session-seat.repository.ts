import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { SessionSeat } from '../entity/session-seat';

@Injectable()
export class SessionSeatRepository extends LinqRepository<SessionSeat> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, SessionSeat);
  }

  getById(id: number | string): IQuery<SessionSeat, SessionSeat> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<SessionSeat, SessionSeat> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<SessionSeat, SessionSeat[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}