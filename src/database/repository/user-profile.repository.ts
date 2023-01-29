import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { UserProfile } from '../entity/user-profile';

@Injectable()
export class UserProfileRepository extends LinqRepository<UserProfile> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, UserProfile);
  }
}