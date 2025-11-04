import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadBannerDto {
  @ApiProperty({
    description: 'The image file to upload',
    type: 'string',
    format: 'binary'
  })
  file: any;

  @ApiPropertyOptional({
    description: 'Optional display order (1-4) to activate the banner immediately',
    example: 1,
    minimum: 1,
    maximum: 4,
    nullable: true
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(1, { message: 'El orden debe ser al menos 1' })
  @Max(4, { message: 'El orden no puede ser mayor a 4' })
  displayOrder?: number;
}
