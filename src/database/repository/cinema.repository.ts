import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { IQuery, LinqRepository } from 'typeorm-linq-repository';
import { Cinema } from "../entity/cinema";

@Injectable()
export class CinemaRepository extends LinqRepository<Cinema> {
  public constructor(
    @InjectDataSource()
      dataSource: DataSource
  ) {
    super(dataSource, Cinema);
  }

  getById(id: number | string): IQuery<Cinema, Cinema> {
    return super.getById(id).where(x => x.deleted).isFalse();
  }

  getOne(): IQuery<Cinema, Cinema> {
    return super.getOne().where(x => x.deleted).isFalse();
  }

  getAll(): IQuery<Cinema, Cinema[]> {
    return super.getAll().where(x => x.deleted).isFalse();
  }
}