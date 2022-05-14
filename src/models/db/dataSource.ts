import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Boards from './Boards';
import Cards from './Cards';
import Users from './Users';
import Votes from './Votes';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Boards, Cards, Users, Votes],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
