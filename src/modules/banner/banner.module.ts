import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerImage } from './entities/banner-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BannerImage]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
