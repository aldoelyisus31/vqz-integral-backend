import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompletedWorkDto {
  @ApiProperty({ description: 'Title of the work', example: 'Modern Kitchen Renovation' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the work', example: 'Complete kitchen remodel with modern fixtures' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether work is active/visible (admin only)', example: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
