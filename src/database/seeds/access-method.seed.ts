import { DataSource } from 'typeorm';
import { AccessMethod } from '../../modules/users/entities/access-method.entity';

const logTitle = '\x1b[34m__ACCESS METHODS SEED:\x1b[0m';

export const seedAccessMethods = async (dataSource: DataSource) => {
  const accessMethodRepository = dataSource.getRepository(AccessMethod);

  // Check if access methods already exist
  const existingMethods = await accessMethodRepository.find();
  if (existingMethods.length > 0) {
    console.log(`${logTitle} ⏩ Access methods already seeded, skipping...`);
    console.log('-----------------------------');
    return;
  }

  // Create access methods
  const accessMethods = [
    { methodName: 'credentials' },
    { methodName: 'google' }
  ];

  await accessMethodRepository.save(accessMethods);
  console.log(`${logTitle} ✅ Access methods seeded successfully`);
  console.log('-----------------------------');
};