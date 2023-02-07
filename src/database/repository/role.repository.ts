import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Role } from '../entity/role';

@Injectable()
export class RoleRepository extends LinqRepository<Role> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource,
  ) {
    super(dataSource, Role);
  }

  getById(id: number | string): IQuery<Role, Role> {
    return super.getById(id).and(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Role, Role> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Role, Role[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}