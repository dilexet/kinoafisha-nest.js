import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { LinqRepository } from "typeorm-linq-repository";
import { Cinema } from "../entity/cinema";

@Injectable()
export class CinemaRepository extends LinqRepository<Cinema> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource
  ) {
    super(dataSource, Cinema);
  }
}