import { PartialType } from '@nestjs/swagger';
import { CreateUserTypeDto } from './create-user-type.dto';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserTypeDto extends PartialType(CreateUserTypeDto) {
  @ApiPropertyOptional({
    description: 'The name of the user type',
    example: 'Administrador',
    minLength: 2,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El nombre del tipo debe ser un texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  typeName?: string;
}
