import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserCredential } from '../../users/entities/user-credential.entity';

@Entity('user_types')
export class UserType {
  @ApiProperty({
    description: 'The unique identifier of the user type',
    example: 1
  })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'The name of the user type',
    example: 'Administrador'
  })
  @Column({ type: 'text', unique: true, name: 'typeName' })
  typeName: string;

  @OneToMany(() => UserCredential, (credential) => credential.userType)
  credentials: UserCredential[];
}
