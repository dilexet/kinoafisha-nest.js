import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { LinqRepository } from "typeorm-linq-repository";
import { Address } from "../entity/address";

@Injectable()
export class AddressRepository extends LinqRepository<Address> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource
  ) {
    super(dataSource, Address);
  }
}