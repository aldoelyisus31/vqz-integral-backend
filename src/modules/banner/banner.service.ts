import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { BannerImage } from './entities/banner-image.entity';
import { FilterBannerDto, UpdateBannerOrderDto } from './dto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class BannerService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads', 'banners');

  constructor(
    @InjectRepository(BannerImage)
    private readonly bannerRepository: Repository<BannerImage>,
  ) {
    // Asegurar que el directorio de uploads existe
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: any, userId: number, displayOrder?: number): Promise<BannerImage> {
    try {
      // Si se especifica un displayOrder, manejar conflictos
      if (displayOrder !== null && displayOrder !== undefined) {
        const existingBanner = await this.bannerRepository.findOne({
          where: { displayOrder },
        });

        if (existingBanner) {
          // INTERCAMBIO: Desactivar la imagen que estaba en esa posición
          existingBanner.displayOrder = null;
          existingBanner.isActive = false;
          await this.bannerRepository.save(existingBanner);
          
          console.log(`🔄 Reemplazo en upload: Imagen ${existingBanner.id} desactivada de posición ${displayOrder}`);
        } else {
          // No hay conflicto, verificar límite de 4 activos
          const activeCount = await this.bannerRepository.count({
            where: { 
              isActive: true,
              displayOrder: Not(IsNull())
            },
          });

          if (activeCount >= 4) {
            throw new BadRequestException(
              'Ya hay 4 imágenes activas en el banner. Desactiva una antes de activar otra.'
            );
          }
        }
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `banner-${timestamp}${extension}`;
      const filepath = path.join(this.uploadPath, filename);

      // Guardar archivo en el sistema de archivos
      await fs.promises.writeFile(filepath, file.buffer);

      // Crear registro en la base de datos
      const imageUrl = `/uploads/banners/${filename}`;
      const bannerImage = this.bannerRepository.create({
        imageUrl,
        originalName: file.originalname,
        uploadedBy: userId,
        isActive: displayOrder !== null && displayOrder !== undefined,
        displayOrder: displayOrder || null,
      });

      return await this.bannerRepository.save(bannerImage);
    } catch (error) {
      // Si es un error conocido, re-lanzarlo
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al subir la imagen: ${error.message}`
      );
    }
  }

  async findAll(): Promise<BannerImage[]> {
    return await this.bannerRepository.find({
      order: { 
        displayOrder: 'ASC',
        createdAt: 'DESC' 
      },
      relations: ['user'],
    });
  }

  async findActive(): Promise<BannerImage[]> {
    return await this.bannerRepository.find({
      where: { 
        isActive: true,
        displayOrder: Not(IsNull())
      },
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<BannerImage> {
    const banner = await this.bannerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!banner) {
      throw new NotFoundException(`Imagen de banner con ID ${id} no encontrada`);
    }

    return banner;
  }

  async findByParams(filterDto: FilterBannerDto): Promise<BannerImage[]> {
    const where: any = {};

    if (filterDto.id) {
      where.id = parseInt(filterDto.id);
    }

    if (filterDto.isActive !== undefined) {
      where.isActive = filterDto.isActive;
    }

    if (filterDto.displayOrder !== undefined) {
      where.displayOrder = filterDto.displayOrder;
    }

    return await this.bannerRepository.find({
      where,
      order: { 
        displayOrder: 'ASC',
        createdAt: 'DESC' 
      },
      relations: ['user'],
    });
  }

  async updateOrder(id: number, updateOrderDto: UpdateBannerOrderDto): Promise<BannerImage> {
    const banner = await this.findOne(id);

    // Si se está estableciendo un orden (1-4)
    if (updateOrderDto.displayOrder !== null && updateOrderDto.displayOrder !== undefined) {
      // Verificar si ya existe otra imagen con ese orden
      const existingBanner = await this.bannerRepository.findOne({
        where: { displayOrder: updateOrderDto.displayOrder },
      });

      if (existingBanner && existingBanner.id !== id) {
        // INTERCAMBIO AUTOMÁTICO: Usar transacción para evitar conflictos de UNIQUE constraint
        const currentOrder = banner.displayOrder;
        
        // Paso 1: Temporalmente establecer el displayOrder de la imagen existente en null
        existingBanner.displayOrder = null;
        await this.bannerRepository.save(existingBanner);
        
        // Paso 2: Establecer el nuevo displayOrder para la imagen actual
        banner.displayOrder = updateOrderDto.displayOrder;
        banner.isActive = true;
        await this.bannerRepository.save(banner);
        
        // Paso 3: Si la imagen actual tenía un displayOrder, asignarlo a la imagen existente
        if (currentOrder !== null && currentOrder !== undefined) {
          existingBanner.displayOrder = currentOrder;
          existingBanner.isActive = true;
          await this.bannerRepository.save(existingBanner);
          
          console.log(`🔄 Intercambio: Imagen ${existingBanner.id} movida de posición ${updateOrderDto.displayOrder} a posición ${currentOrder}`);
        } else {
          // Si la imagen actual no tenía orden, dejar la existente desactivada
          existingBanner.isActive = false;
          await this.bannerRepository.save(existingBanner);
          
          console.log(`🔄 Reemplazo: Imagen ${existingBanner.id} desactivada de posición ${updateOrderDto.displayOrder}`);
        }
        
        return banner;
      } else {
        // No hay conflicto, verificar límite de 4 activos solo si es una nueva activación
        if (!banner.isActive) {
          const activeCount = await this.bannerRepository.count({
            where: { 
              isActive: true,
              displayOrder: Not(IsNull())
            },
          });

          if (activeCount >= 4) {
            throw new BadRequestException(
              'Ya hay 4 imágenes activas en el banner. Desactiva una antes de activar otra.'
            );
          }
        }
        
        banner.displayOrder = updateOrderDto.displayOrder;
        banner.isActive = true;
      }
    } else {
      // Si se establece en null, desactivar
      banner.displayOrder = null;
      banner.isActive = false;
    }

    return await this.bannerRepository.save(banner);
  }

  async remove(id: number): Promise<void> {
    const banner = await this.findOne(id);

    try {
      // Eliminar archivo físico
      const filepath = path.join(process.cwd(), banner.imageUrl);
      if (fs.existsSync(filepath)) {
        await unlinkAsync(filepath);
      }

      // Eliminar registro de la base de datos
      await this.bannerRepository.remove(banner);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar la imagen: ${error.message}`
      );
    }
  }

  async getActiveCount(): Promise<number> {
    return await this.bannerRepository.count({
      where: { 
        isActive: true,
        displayOrder: Not(IsNull())
      },
    });
  }
}
