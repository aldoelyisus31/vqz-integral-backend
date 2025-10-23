import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterUserTypeDto {
  @ApiPropertyOptional({
    description: 'Filter by user type ID',
    example: 1
  })
  @IsOptional()
  @IsNumberString({}, { message: 'El ID debe ser un número' })
  id?: string;

  @ApiPropertyOptional({
    description: 'Filter by type name (partial match)',
    example: 'Admin'
  })
  @IsOptional()
  @IsString({ message: 'El nombre del tipo debe ser un texto' })
  typeName?: string;
}
