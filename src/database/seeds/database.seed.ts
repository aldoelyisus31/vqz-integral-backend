import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';
import { seedAccessMethods } from './access-method.seed';
import { seedUserTypes } from './user-type.seed';

export const seedDatabase = async (dataSource: DataSource) => {
  try {
    console.log('Starting database seeding...');
    
    // Run seeds in sequence - access methods and user types must run before users
    await seedAccessMethods(dataSource);
    await seedUserTypes(dataSource);
    await seedUsers(dataSource);
    
    console.log('\x1b[32m***Database seeding completed successfully***\x1b[0m');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};