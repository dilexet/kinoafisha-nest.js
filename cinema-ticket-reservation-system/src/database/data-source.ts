import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import UserSeeder from './seeds/userSeeder';
import { User } from './entity/user';
import { Role } from './entity/role';
import { Token } from './entity/token';
import { Cinema } from './entity/cinema';
import { Hall } from './entity/hall';
import { Row } from './entity/row';
import { Seat } from './entity/seat';
import { Movie } from './entity/movie';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'cinema_db',
  synchronize: true,
  logging: false,
  entities: [User, Role, Token, Cinema, Hall, Row, Seat, Movie],
  seeds: [UserSeeder],
  migrations: [],
  subscribers: [],
};

export const dataSource = new DataSource(options);