import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  UseGuards, 
  HttpStatus, 
  ParseIntPipe,
  Query,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth, 
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { UserTypeService } from './user-type.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { FilterUserTypeDto } from './dto/filter-user-type.dto';
import { UserType } from './entities/user-type.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogAction } from '../action-logs/decorators/log-action.decorator';

@ApiTags('User Types')
@Controller('user-type')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  @LogAction('CREATE', 'Tipo de usuario creado exitosamente')
  @ApiOperation({ summary: 'Create a new user type' })
  @ApiBody({
    type: CreateUserTypeDto,
    examples: {
      example1: {
        summary: 'Example user type creation',
        value: {
          typeName: 'Administrador',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User type has been successfully created.',
    type: UserType,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User type name already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async create(@Body() createUserTypeDto: CreateUserTypeDto): Promise<UserType> {
    try {
      return await this.userTypeService.create(createUserTypeDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all user types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all user types.',
    type: [UserType],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findAll(): Promise<UserType[]> {
    return await this.userTypeService.findAll();
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter user types with multiple criteria' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Filter by user type ID',
    schema: { type: 'integer' },
  })
  @ApiQuery({
    name: 'typeName',
    required: false,
    description: 'Filter by type name (partial match)',
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns filtered user types.',
    type: [UserType],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async filterUserTypes(@Query() filterDto: FilterUserTypeDto): Promise<UserType[]> {
    return await this.userTypeService.findByParams(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user type by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User type ID',
    schema: { type: 'integer' },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user type.',
    type: UserType,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User type not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserType> {
    return await this.userTypeService.findOne(id);
  }

  @Put(':id')
  @LogAction('UPDATE', 'Tipo de usuario actualizado exitosamente')
  @ApiOperation({ summary: 'Update user type by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User type ID to update',
    schema: { type: 'integer' },
  })
  @ApiBody({
    type: UpdateUserTypeDto,
    examples: {
      example1: {
        summary: 'Example user type update',
        value: {
          typeName: 'Super Administrador',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User type has been successfully updated.',
    type: UserType,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User type not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User type name already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserTypeDto: UpdateUserTypeDto
  ): Promise<UserType> {
    try {
      return await this.userTypeService.update(id, updateUserTypeDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @LogAction('DELETE', 'Tipo de usuario eliminado exitosamente')
  @ApiOperation({ summary: 'Delete user type by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User type ID to delete',
    schema: { type: 'integer' },
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User type has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User type not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userTypeService.remove(id);
  }
}
