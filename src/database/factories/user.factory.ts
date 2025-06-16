import { faker } from '@faker-js/faker';
import { User } from '../../modules/users/entities/user.entity';
import { UserType } from '../../modules/users/entities/user-type.entity';
import { AccessMethod } from '../../modules/users/entities/access-method.entity';
import { createUserCredentialFactory } from './user-credential.factory';
import { UserCredential } from '../../modules/users/entities/user-credential.entity';

export interface CreateUserOptions {
  userType: UserType;
  accessMethod: AccessMethod;
}

export const createUserFactory = (options: CreateUserOptions): Partial<User> & { credentials: Partial<UserCredential>[] } => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  const user = {
    username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    fullName: `${firstName} ${lastName}`,
  } as User;

  // Create the credential relationship
  const credential = createUserCredentialFactory(user, options.userType, options.accessMethod);
  
  return {
    ...user,
    credentials: [credential as UserCredential],
  };
};