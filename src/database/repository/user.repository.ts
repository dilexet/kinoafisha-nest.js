import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { User } from '../entity/user';

@Injectable()
export class UserRepository extends LinqRepository<User> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, User);
  }

  getById(id: number | string): IQuery<User, User> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<User, User> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<User, User[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}