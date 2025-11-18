import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({ description: 'Branch name', example: 'Sucursal Centro' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Branch address', example: 'Av. Principal #123, Col. Centro' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate (-90 to 90)', example: 19.432608 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate (-180 to 180)', example: -99.133209 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
