import { IsString, IsEmail, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The username of the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El username debe ser un texto' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El username no puede exceder 50 caracteres' })
  username?: string;

  @ApiPropertyOptional({
    description: 'The email address of the user',
    example: 'john.doe@example.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'The full name of the user',
    example: 'John Doe',
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @MaxLength(100, { message: 'El nombre completo no puede exceder 100 caracteres' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'The profile image URL of the user',
    example: 'https://example.com/profile.jpg'
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser un texto' })
  profileImage?: string;

  @ApiPropertyOptional({
    description: 'The user type ID',
    example: 2
  })
  @IsOptional()
  @IsInt({ message: 'El userTypeId debe ser un número entero' })
  userTypeId?: number;

  @ApiPropertyOptional({
    description: 'The new password (optional)',
    example: 'newSecurePassword123'
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}
