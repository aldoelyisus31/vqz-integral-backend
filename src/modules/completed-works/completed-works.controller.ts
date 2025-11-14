import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Param, ParseIntPipe, Put, Delete, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CompletedWorksService } from './completed-works.service';
import { CreateCompletedWorkDto } from './dto/create-completed-work.dto';
import { UpdateCompletedWorkDto } from './dto/update-completed-work.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogAction } from '../action-logs/decorators/log-action.decorator';

@ApiTags('Completed Works')
@Controller('completed-works')
export class CompletedWorksController {
  constructor(private readonly service: CompletedWorksService) {}

  private normalizeDto(dto: any) {
    if (!dto) return dto;
    if (dto.dto) {
      try {
        return typeof dto.dto === 'string' ? JSON.parse(dto.dto) : dto.dto;
      } catch (e) {
        return dto;
      }
    }

    const normalized: any = {};
    for (const key of Object.keys(dto)) {
      const val = dto[key];
      if (val === 'true') normalized[key] = true;
      else if (val === 'false') normalized[key] = false;
      else if (!isNaN(val) && val !== '') normalized[key] = Number(val);
      else normalized[key] = val;
    }
    return normalized;
  }

  // Public endpoint: get active works
  @Get('public')
  @ApiOperation({ summary: 'Public: get all active completed works' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of active completed works' })
  async getActiveWorks() {
    return await this.service.findAllActive();
  }

  // Admin endpoints
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('CREATE', 'Trabajo realizado creado exitosamente')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Admin: create completed work' })
  @ApiBody({ type: CreateCompletedWorkDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Completed work created.' })
  async create(@Body() dto: any, @UploadedFile() file: any) {
    const payload = this.normalizeDto(dto);
    return await this.service.create(payload, file);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Admin: get all completed works' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all completed works' })
  async getAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get completed work by id' })
  @ApiParam({ name: 'id', schema: { type: 'integer' } })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE', 'Trabajo realizado actualizado exitosamente')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Admin: update completed work' })
  @ApiBody({ type: UpdateCompletedWorkDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @UploadedFile() file: any) {
    const payload = this.normalizeDto(dto);
    return await this.service.update(id, payload, file);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('DELETE', 'Trabajo realizado eliminado exitosamente')
  @ApiOperation({ summary: 'Admin: soft delete completed work' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.softDelete(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE', 'Trabajo realizado restaurado exitosamente')
  @ApiOperation({ summary: 'Admin: restore completed work' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.service.restore(id);
  }

  @Get('deleted/all')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Admin: get all completed works including deleted' })
  async getAllWithDeleted() {
    return await this.service.findAllWithDeleted();
  }

  @Delete(':id/permanent')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('DELETE', 'Trabajo realizado eliminado permanentemente')
  @ApiOperation({ summary: 'Admin: permanently delete completed work' })
  async permanentDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.permanentDelete(id);
  }
}
