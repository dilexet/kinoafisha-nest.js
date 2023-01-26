import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LinqRepository } from 'typeorm-linq-repository';
import { Role } from '../entity/role';

@Injectable()
export class RoleRepository extends LinqRepository<Role> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Role);
  }
}