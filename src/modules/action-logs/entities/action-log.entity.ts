import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('action_logs')
export class ActionLog {
  @ApiProperty({
    description: 'The unique identifier of the action log',
    example: 1
  })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'The type of action performed',
    example: 'CREATE',
    enum: ['CREATE', 'UPDATE', 'DELETE']
  })
  @Column({ type: 'text' })
  action: string;

  @ApiProperty({
    description: 'Human-readable description of the action',
    example: 'Creación de usuario con id 3'
  })
  @Column({ type: 'text', name: 'textDescription' })
  textDescription: string;

  @ApiProperty({
    description: 'The ID of the user who performed the action',
    example: 1
  })
  @Column({ type: 'bigint', name: 'userId' })
  userId: number;

  @ApiProperty({
    description: 'The endpoint that was called',
    example: '/api/users'
  })
  @Column({ type: 'text' })
  endpoint: string;

  @ApiProperty({
    description: 'The HTTP method used',
    example: 'POST'
  })
  @Column({ type: 'text' })
  method: string;

  @ApiProperty({
    description: 'The timestamp when the action was performed'
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'createdAt' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
