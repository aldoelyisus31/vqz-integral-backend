import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('completed_works')
export class CompletedWork {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Title of the completed work', example: 'Modern Kitchen Renovation' })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({ description: 'Description of the work', example: 'Complete kitchen remodel with modern fixtures', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Relative path to stored image', example: '/uploads/completed-works/163....jpg', required: false })
  @Column({ type: 'text', nullable: true })
  imagePath?: string;

  @ApiProperty({ description: 'Whether the work is active/visible', example: true })
  @Column({ type: 'boolean', default: false })
  active: boolean;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ApiProperty({ description: 'Soft delete timestamp', required: false })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
