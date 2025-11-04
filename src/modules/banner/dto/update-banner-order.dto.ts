import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBannerOrderDto {
  @ApiPropertyOptional({
    description: 'The display order for the banner (1-4). Set to null to remove from active banners.',
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
  displayOrder?: number | null;
}
