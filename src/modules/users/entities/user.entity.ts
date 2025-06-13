import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { UserCredential } from './user-credential.entity';
import { AccessHistory } from './access-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  fullName: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => UserCredential, (credential) => credential.user)
  credentials: UserCredential[];

  @OneToMany(() => AccessHistory, (history) => history.user)
  accessHistory: AccessHistory[];
}