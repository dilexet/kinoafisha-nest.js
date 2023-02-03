import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Address } from "../entity/address";

@Injectable()
export class AddressRepository extends LinqRepository<Address> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource
  ) {
    super(dataSource, Address);
  }

  getById(id: number | string): IQuery<Address, Address> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Address, Address> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Address, Address[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}