import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe, Put, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogAction } from '../action-logs/decorators/log-action.decorator';
import { Branch } from './entities/branch.entity';

@ApiTags('Branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly service: BranchesService) {}

  // Public endpoint: get all branches for landing page
  @Get('public')
  @ApiOperation({ summary: 'Public: get all branches for landing page' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all branches with addresses and coordinates',
    type: [Branch]
  })
  async getAllPublic() {
    return await this.service.findAll();
  }

  // Admin endpoints
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('CREATE', 'Sucursal creada exitosamente')
  @ApiOperation({ summary: 'Admin: create branch' })
  @ApiBody({ type: CreateBranchDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Branch created successfully.',
    type: Branch
  })
  async create(@Body() dto: CreateBranchDto) {
    return await this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Admin: get all branches' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all branches',
    type: [Branch]
  })
  async getAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Admin: get branch by id' })
  @ApiParam({ name: 'id', schema: { type: 'integer' } })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Branch found',
    type: Branch
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Branch not found'
  })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE', 'Sucursal actualizada exitosamente')
  @ApiOperation({ summary: 'Admin: update branch' })
  @ApiParam({ name: 'id', schema: { type: 'integer' } })
  @ApiBody({ type: UpdateBranchDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Branch updated successfully',
    type: Branch
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Branch not found'
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @LogAction('DELETE', 'Sucursal eliminada exitosamente')
  @ApiOperation({ summary: 'Admin: delete branch' })
  @ApiParam({ name: 'id', schema: { type: 'integer' } })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Branch deleted successfully'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Branch not found'
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
