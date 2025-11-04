import {Controller, Get, Post,Body, Param, Delete, UseGuards, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, Query, Put, BadRequestException, Req, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody, ApiQuery, } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { BannerImage } from './entities/banner-image.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogAction } from '../action-logs/decorators/log-action.decorator';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { FilterBannerDto, UpdateBannerOrderDto, UploadBannerDto } from './dto';

@ApiTags('Banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('CREATE', 'Imagen de banner subida exitosamente')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a banner image with optional display order (Admin only)' })
  @ApiBody({
    description: 'Banner image file with optional display order',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload'
        },
        displayOrder: {
          type: 'integer',
          minimum: 1,
          maximum: 4,
          nullable: true,
          description: 'Optional display order (1-4) to activate the banner immediately'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Banner image has been successfully uploaded.',
    type: BannerImage,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file format, size, or maximum active banners reached.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Display order already in use.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async upload(
    @UploadedFile(new ImageValidationPipe()) file: any,
    @Body('displayOrder') displayOrder: string,
    @Req() request: any,
  ): Promise<BannerImage> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const userId = request.user?.userId || request.user?.sub || request.user?.id;
    const order = displayOrder ? parseInt(displayOrder, 10) : undefined;
    
    return await this.bannerService.upload(file, userId, order);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all banner images (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all banner images.',
    type: [BannerImage],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findAll(): Promise<BannerImage[]> {
    return await this.bannerService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active banner images (Public endpoint)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns active banner images ordered by display order.',
    type: [BannerImage],
  })
  async findActive(): Promise<BannerImage[]> {
    return await this.bannerService.findActive();
  }

  @Get('filter')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Filter banner images (Admin only)' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Filter by banner ID',
    schema: { type: 'integer' },
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    schema: { type: 'boolean' },
  })
  @ApiQuery({
    name: 'displayOrder',
    required: false,
    description: 'Filter by display order (1-4)',
    schema: { type: 'integer', minimum: 1, maximum: 4 },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns filtered banner images.',
    type: [BannerImage],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async filterBanners(@Query() filterDto: FilterBannerDto): Promise<BannerImage[]> {
    return await this.bannerService.findByParams(filterDto);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get banner image by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Banner image ID',
    schema: { type: 'integer' },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the banner image.',
    type: BannerImage,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner image not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BannerImage> {
    return await this.bannerService.findOne(id);
  }

  @Put(':id/order')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE', 'Orden de banner actualizado exitosamente')
  @ApiOperation({ 
    summary: 'Update banner display order with automatic position swap (Admin only)',
    description: 'If the target position is occupied, the images will automatically swap positions. If the current image has no position, the existing image will be deactivated.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Banner image ID',
    schema: { type: 'integer' },
  })
  @ApiBody({
    type: UpdateBannerOrderDto,
    examples: {
      activate: {
        summary: 'Set banner as active with order',
        value: { displayOrder: 1 },
      },
      swap: {
        summary: 'Swap positions with another banner',
        description: 'If position 1 is occupied, images will automatically swap positions',
        value: { displayOrder: 1 },
      },
      deactivate: {
        summary: 'Remove banner from active display',
        value: { displayOrder: null },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Banner order has been successfully updated. If position was occupied, images were automatically swapped.',
    type: BannerImage,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner image not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Maximum active banners reached (only when activating a new banner without swap).',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateBannerOrderDto,
  ): Promise<BannerImage> {
    return await this.bannerService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('DELETE', 'Imagen de banner eliminada exitosamente')
  @ApiOperation({ summary: 'Delete banner image (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Banner image ID to delete',
    schema: { type: 'integer' },
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Banner image has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner image not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.bannerService.remove(id);
  }
}
