import { IsOptional, IsBoolean, IsNumberString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterBannerDto {
  @ApiPropertyOptional({
    description: 'Filter by banner ID',
    example: 1
  })
  @IsOptional()
  @IsNumberString({}, { message: 'El ID debe ser un número' })
  id?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by display order',
    example: 1,
    minimum: 1,
    maximum: 4
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(1, { message: 'El orden debe ser al menos 1' })
  @Max(4, { message: 'El orden no puede ser mayor a 4' })
  displayOrder?: number;
}
