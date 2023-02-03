import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { UserProfile } from '../entity/user-profile';

@Injectable()
export class UserProfileRepository extends LinqRepository<UserProfile> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, UserProfile);
  }

  getById(id: number | string): IQuery<UserProfile, UserProfile> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<UserProfile, UserProfile> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<UserProfile, UserProfile[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}