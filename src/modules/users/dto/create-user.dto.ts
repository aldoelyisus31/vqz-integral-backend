import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'password123',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'The user type ID',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  userTypeId: number;

  @ApiProperty({
    description: 'The access method ID',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  accessMethodId: number;
}