import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserCredential } from './user-credential.entity';
import { AccessHistory } from './access-history.entity';

@Entity('access_methods')
export class AccessMethod {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', unique: true })
  methodName: string;

  @OneToMany(() => UserCredential, (credential) => credential.accessMethod)
  credentials: UserCredential[];

  @OneToMany(() => AccessHistory, (history) => history.accessMethod)
  accessHistory: AccessHistory[];
}