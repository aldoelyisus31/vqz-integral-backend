import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { UserType } from './user-type.entity';
import { AccessMethod } from './access-method.entity';

@Entity('user_credentials')
export class UserCredential {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'text', nullable: true })
  passwordHash: string;

  @Column({ type: 'bigint' })
  userTypeId: number;

  @Column({ type: 'bigint' })
  accessMethodId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => UserType, (userType) => userType.credentials)
  @JoinColumn({ name: 'userTypeId' })
  userType: UserType;

  @ManyToOne(() => AccessMethod, (accessMethod) => accessMethod.credentials)
  @JoinColumn({ name: 'accessMethodId' })
  accessMethod: AccessMethod;
}