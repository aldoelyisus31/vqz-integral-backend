import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserCredential } from './user-credential.entity';

@Entity('user_types')
export class UserType {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', unique: true })
  typeName: string;

  @OneToMany(() => UserCredential, (credential) => credential.userType)
  credentials: UserCredential[];
}