import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompletedWorkDto {
  @ApiPropertyOptional({ description: 'Title of the work', example: 'Updated Kitchen Design' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the work', example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether work is active/visible', example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
