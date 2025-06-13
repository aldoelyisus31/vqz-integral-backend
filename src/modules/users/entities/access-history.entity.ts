import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AccessMethod } from './access-method.entity';

@Entity('access_history')
export class AccessHistory {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  accessTime: Date;

  @Column({ type: 'bigint' })
  accessMethodId: number;

  @ManyToOne(() => User, (user) => user.accessHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => AccessMethod, (accessMethod) => accessMethod.accessHistory)
  @JoinColumn({ name: 'accessMethodId' })
  accessMethod: AccessMethod;
}