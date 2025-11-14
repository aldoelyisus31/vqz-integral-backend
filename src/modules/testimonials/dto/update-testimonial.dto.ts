import { IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTestimonialDto {
  @ApiPropertyOptional({ description: 'Name of the person', example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the testimonial', example: 'They were awesome!' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether testimonial is active', example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Stars 0-5', example: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  stars?: number;
}
