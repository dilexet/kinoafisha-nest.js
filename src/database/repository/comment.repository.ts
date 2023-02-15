import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Comment } from '../entity/comment';

@Injectable()
export class CommentRepository extends LinqRepository<Comment> {
  public constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    super(dataSource, Comment);
  }

  getById(id: number | string): IQuery<Comment, Comment> {
    return super
      .getById(id)
      .and((x) => x.deleted)
      .isFalse();
  }

  getOne(): IQuery<Comment, Comment> {
    return super
      .getOne()
      .and((x) => x.deleted)
      .isFalse();
  }

  getAll(): IQuery<Comment, Comment[]> {
    return super
      .getAll()
      .and((x) => x.deleted)
      .isFalse();
  }
}
