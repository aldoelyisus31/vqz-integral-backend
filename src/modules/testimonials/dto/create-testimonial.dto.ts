import { IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ description: 'Name of the person', example: 'Jane Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the testimonial', example: 'They were awesome!', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Whether testimonial is active (admin)', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ description: 'Stars 0-5', example: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  stars?: number;
}
