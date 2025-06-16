import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { seedDatabase } from './seeds/database.seed';

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: `.env.${nodeEnv}` });

// TypeORM data source configuration
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: nodeEnv !== 'PRODUCTION',
});

const runSeed = async () => {
  try {
    await dataSource.initialize();
    console.log('Database connection initialized');

    await seedDatabase(dataSource);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeed();