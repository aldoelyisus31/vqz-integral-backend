import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserCredential } from './user-credential.entity';
import { AccessHistory } from './access-history.entity';
import { IsOptional } from 'class-validator';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1
  })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe'
  })
  @Column({ type: 'text', unique: true })
  username: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com'
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @IsOptional()
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @IsOptional()
  @ApiProperty({
    description: 'The profile image URL of the user',
    example: 'https://lh3.googleusercontent.com/a/photo.jpg',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  profileImage?: string;

  @IsOptional()
  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2023-01-01T00:00:00Z'
  })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'The timestamp when the user was soft deleted',
    example: '2023-12-31T23:59:59Z',
    required: false
  })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @IsOptional()
  @OneToMany(() => UserCredential, (credential) => credential.user)
  credentials?: UserCredential[];

  @IsOptional()
  @OneToMany(() => AccessHistory, (history) => history.user)
  accessHistory?: AccessHistory[];
}