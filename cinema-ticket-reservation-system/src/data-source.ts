import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Role } from './entity/Role';
import { Token } from './entity/Token';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'cinema_db',
    synchronize: true,
    logging: false,
    entities: [User, Role, Token],
    migrations: [],
    subscribers: [],
});
