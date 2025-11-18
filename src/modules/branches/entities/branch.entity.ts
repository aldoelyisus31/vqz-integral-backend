import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('branches')
export class Branch {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Branch name', example: 'Sucursal Centro' })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({ description: 'Branch address', example: 'Av. Principal #123, Col. Centro' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ description: 'Latitude coordinate', example: 19.432608, required: false })
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -99.133209, required: false })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
