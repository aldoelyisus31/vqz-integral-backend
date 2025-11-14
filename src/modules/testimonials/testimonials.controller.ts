import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Param, ParseIntPipe, Put, Delete, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogAction } from '../action-logs/decorators/log-action.decorator';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  private normalizeDto(dto: any) {
    if (!dto) return dto;
    // If client sent a single field named "dto" (JSON string or object), parse it
    if (dto.dto) {
      try {
        return typeof dto.dto === 'string' ? JSON.parse(dto.dto) : dto.dto;
      } catch (e) {
        return dto;
      }
    }

    // If fields are strings (multipart/form-data), convert numeric/boolean-like values
    const normalized: any = {};
    for (const key of Object.keys(dto)) {
      const val = dto[key];
      // try parse booleans
      if (val === 'true') normalized[key] = true;
      else if (val === 'false') normalized[key] = false;
      else if (!isNaN(val) && val !== '') normalized[key] = Number(val);
      else normalized[key] = val;
    }
    return normalized;
  }

  // Public endpoint: users can submit testimonials (marked active automatically)
  @Post('public')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Public: create testimonial (auto active)' })
  @ApiBody({ type: CreateTestimonialDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Testimonial created and marked active.' })
  async createPublic(@Body() dto: any, @UploadedFile() file: any) {
    const payload = this.normalizeDto(dto);
    return await this.service.createPublic(payload, file);
  }

  // Admin endpoints
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('CREATE', 'Testimonial creado exitosamente')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Admin: create testimonial' })
  @ApiBody({ type: CreateTestimonialDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Testimonial created.' })
  async createAdmin(@Body() dto: any, @UploadedFile() file: any) {
    const payload = this.normalizeDto(dto);
    return await this.service.createAdmin(payload, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active testimonials' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of active testimonials' })
  async getAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get testimonial by id' })
  @ApiParam({ name: 'id', schema: { type: 'integer' } })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE', 'Testimonial actualizado exitosamente')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Admin: update testimonial' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @UploadedFile() file: any) {
    const payload = this.normalizeDto(dto);
    return await this.service.update(id, payload, file);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('DELETE', 'Testimonial eliminado exitosamente')
  @ApiOperation({ summary: 'Admin: soft delete testimonial' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.softDelete(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE', 'Testimonial restaurado exitosamente')
  @ApiOperation({ summary: 'Admin: restore testimonial' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.service.restore(id);
  }

  @Get('deleted/all')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Admin: get all testimonials including deleted' })
  async getAllWithDeleted() {
    return await this.service.findAllWithDeleted();
  }

  @Delete(':id/permanent')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('DELETE', 'Testimonial eliminado permanentemente')
  @ApiOperation({ summary: 'Admin: permanently delete testimonial' })
  async permanentDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.permanentDelete(id);
  }
}
