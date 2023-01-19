import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entity/User';
import { Role } from './entity/Role';
import { Token } from './entity/Token';
import { SeederOptions } from 'typeorm-extension';
import UserSeeder from './seeds/userSeeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'cinema_db',
  synchronize: true,
  logging: false,
  entities: [User, Role, Token],
  seeds: [UserSeeder],
  migrations: [],
  subscribers: [],
};

export const dataSource = new DataSource(options);