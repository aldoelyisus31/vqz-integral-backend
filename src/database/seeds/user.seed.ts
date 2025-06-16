import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { appConfig } from '../../config/app.config';
import { User } from '../../modules/users/entities/user.entity';
import { createUserFactory } from '../factories/user.factory';
import { UserCredential } from '../../modules/users/entities/user-credential.entity';
import { UserType } from '../../modules/users/entities/user-type.entity';
import { AccessMethod } from '../../modules/users/entities/access-method.entity';

const logTitle = '\x1b[34m__USER SEED:\x1b[0m';

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const credentialRepository = dataSource.getRepository(UserCredential);
  const userTypeRepository = dataSource.getRepository(UserType);
  const accessMethodRepository = dataSource.getRepository(AccessMethod);

  const userTypes = await userTypeRepository.find();
  const accessMethods = await accessMethodRepository.find();

  if (userTypes.length === 0 || accessMethods.length === 0) {
    throw new Error('No user types or access methods found');
  }

  const defaultUserType = userTypes[0];
  const defaultAccessMethod = accessMethods[0];

  const existingRootUser = await userRepository.findOneBy({ username: 'root' });

  if (!existingRootUser) {
    const rootUser = await userRepository.save({
      username: 'root',
      email: 'root@root.com',
      fullName: 'System Administrator',
    });

    await credentialRepository.save({
      user: rootUser,
      userType: defaultUserType,
      accessMethod: defaultAccessMethod,
      passwordHash: await bcrypt.hash('admin123', appConfig.bcrypt.saltRounds),
    });

    console.log(`${logTitle} 👤 Root user created.`);
    console.log(`${logTitle} ⚠️  Remember to change the default root user password!`);
  } else {
    console.log(`${logTitle} ⏩ Root user already exists. Skipping root creation.`);
  }

  if (appConfig.node_env === 'production') {
    console.log(`${logTitle} ⏩ Skipping random user seeding in production environment`);
    console.log('-----------------------------');
    return;
  }

  const users = Array(5).fill(null).map(() => {
    const randomUserType = getRandomItem(userTypes);
    const randomAccessMethod = getRandomItem(accessMethods);
    return createUserFactory({
      userType: randomUserType,
      accessMethod: randomAccessMethod,
    });
  });

  for (const userData of users) {
    const { credentials, ...user } = userData;
    const savedUser = await userRepository.save(user);

    const credential = credentials[0];
    credential.user = savedUser;
    credential.passwordHash = await bcrypt.hash('password123', appConfig.bcrypt.saltRounds);

    await credentialRepository.save(credential);
  }

  console.log(`${logTitle} 👥 Random users seeded.`);
  console.log(`${logTitle} ✅ User seeding completed successfully.`);
  console.log('-----------------------------');
};
