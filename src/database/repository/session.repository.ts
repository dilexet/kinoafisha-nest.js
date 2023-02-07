import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Session } from '../entity/session';

@Injectable()
export class SessionRepository extends LinqRepository<Session> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Session);
  }

  getById(id: number | string): IQuery<Session, Session> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Session, Session> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Session, Session[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}