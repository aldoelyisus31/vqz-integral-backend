import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('banner_images')
export class BannerImage {
  @ApiProperty({
    description: 'The unique identifier of the banner image',
    example: 1
  })
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'The URL/path to the banner image',
    example: '/uploads/banners/banner-123456789.jpg'
  })
  @Column({ type: 'text', name: 'imageUrl' })
  imageUrl: string;

  @ApiProperty({
    description: 'The original name of the uploaded file',
    example: 'banner-promocion.jpg'
  })
  @Column({ type: 'text', name: 'originalName' })
  originalName: string;

  @ApiProperty({
    description: 'The display order of the banner (1-4). Null if not active in banner.',
    example: 1,
    minimum: 1,
    maximum: 4,
    nullable: true
  })
  @Column({ type: 'int', name: 'displayOrder', nullable: true, unique: true })
  displayOrder: number | null;

  @ApiProperty({
    description: 'Whether this image is currently active in the banner',
    example: true,
    default: false
  })
  @Column({ type: 'boolean', name: 'isActive', default: false })
  isActive: boolean;

  @ApiProperty({
    description: 'The ID of the user who uploaded this image',
    example: 1
  })
  @Column({ type: 'bigint', name: 'uploadedBy' })
  uploadedBy: number;

  @ApiProperty({
    description: 'The timestamp when the image was uploaded'
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the image was last updated'
  })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadedBy' })
  user: User;
}
