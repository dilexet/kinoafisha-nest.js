import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Token } from '../entity/token';

@Injectable()
export class TokenRepository extends LinqRepository<Token> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Token);
  }

  getById(id: number | string): IQuery<Token, Token> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Token, Token> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Token, Token[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}