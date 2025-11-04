import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  transform(file: any): any {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar tipo MIME
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Solo se permiten: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Validar tamaño
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `El archivo es demasiado grande. Tamaño máximo permitido: ${this.maxSize / 1024 / 1024}MB`
      );
    }

    return file;
  }
}
