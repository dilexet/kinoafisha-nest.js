import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { SessionSeat } from '../entity/session-seat';

@Injectable()
export class SessionSeatRepository extends LinqRepository<SessionSeat> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, SessionSeat);
  }
}