import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('testimonials')
export class Testimonial {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Name of the person', example: 'Jane Doe' })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({ description: 'Relative path to stored image', example: '/uploads/testimonials/163....jpg', required: false })
  @Column({ type: 'text', nullable: true })
  imagePath?: string;

  @ApiProperty({ description: 'Testimonial description', example: 'Great service!', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Whether the testimonial is active', example: true })
  @Column({ type: 'boolean', default: false })
  active: boolean;

  @ApiProperty({ description: 'Stars (0-5)', example: 5 })
  @Column({ type: 'int', default: 5 })
  stars: number;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @ApiProperty({ description: 'Soft delete timestamp', required: false })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
