import { faker } from '@faker-js/faker';
import { UserCredential } from '../../modules/users/entities/user-credential.entity';
import { User } from '../../modules/users/entities/user.entity';
import { UserType } from '../../modules/users/entities/user-type.entity';
import { AccessMethod } from '../../modules/users/entities/access-method.entity';

export const createUserCredentialFactory = (
  user: User,
  userType: UserType,
  accessMethod: AccessMethod,
): Partial<UserCredential> => {
  return {
    user,
    userType,
    accessMethod,
    userId: user.id,
    userTypeId: userType.id,
    accessMethodId: accessMethod.id,
    passwordHash: faker.internet.password(), // In a real app, this should be properly hashed
  };
};