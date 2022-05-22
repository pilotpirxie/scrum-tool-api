import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Boards from './Boards';
import Cards from './Cards';
import Users from './Users';
import Votes from './Votes';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  synchronize: true,
  logging: true,
  entities: [Boards, Cards, Users, Votes],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
