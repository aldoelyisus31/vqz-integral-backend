import { DataSource } from 'typeorm';
import { UserType } from '../../modules/users/entities/user-type.entity';

const logTitle = '\x1b[34m__USER TYPES SEED:\x1b[0m';
export const seedUserTypes = async (dataSource: DataSource) => {
  const userTypeRepository = dataSource.getRepository(UserType);

  // Check if user types already exist
  const existingTypes = await userTypeRepository.find();
  if (existingTypes.length > 0) {
    console.log(`${logTitle} ⏩ User types already seeded, skipping...`);
    console.log('-----------------------------');
    return;
  }

  // Create user types
  const userTypes = [
    { typeName: 'root' },
    { typeName: 'admin' },
    { typeName: 'customer' }
  ];

  await userTypeRepository.save(userTypes);
  console.log(`${logTitle} ✅ User types seeding completed successfully.`);
  console.log('-----------------------------');
};