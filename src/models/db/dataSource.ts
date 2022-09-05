import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Boards from './Boards';
import Cards from './Cards';
import Users from './Users';
import Votes from './Votes';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  synchronize: true,
  logging: true,
  entities: [Boards, Cards, Users, Votes],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
