import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { appConfig } from '../config/app.config';

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: `.env.${nodeEnv}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: appConfig.db.host,
  port: appConfig.db.port,
  username: appConfig.db.user,
  password: appConfig.db.password,
  database: appConfig.db.name,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: appConfig.node_env !== 'production',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;