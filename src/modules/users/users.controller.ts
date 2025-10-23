import { Controller, Post, Body, NotFoundException, ConflictException, HttpStatus, UseGuards, Get, Query, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogAction } from '../action-logs/decorators/log-action.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*@Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example user registration',
        value: {
          username: 'geraldine',
          email: 'geraldinne@mail.com',
          password: 'password123',
          fullName: 'geraldine calvillo',
          profileImage: 'https://lh3.googleusercontent.com/a/photo.jpg',
          userTypeId: 1,
          accessMethodId: 1,
          accessMethod: 'credentials',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully registered.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username or email already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }*/

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @LogAction('CREATE', 'Usuario creado exitosamente')
  @ApiOperation({ summary: 'Create a resource for authenticated users' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example resource creation',
        value: {
          username: 'john_doe',
          email: 'john.doe@mail.com',
          password: 'securepassword',
          fullName: 'John Doe',
          profileImage: 'https://example.com/profile.jpg',
          userTypeId: 2,
          accessMethodId: 1,
          accessMethod: 'credentials',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Resource created successfully for authenticated user.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async createForAuthenticatedUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Get('filter')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Filter users with multiple criteria' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Filter by user ID',
    schema: { type: 'integer' },
  })
  @ApiQuery({
    name: 'username',
    required: false,
    description: 'Filter by username (partial match)',
    schema: { type: 'string' },
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email (partial match)',
    schema: { type: 'string' },
  })
  @ApiQuery({
    name: 'createdAt',
    required: false,
    description: 'Filter by creation date',
    schema: { type: 'string', format: 'date-time' },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns filtered users.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token required.',
  })
  async filterUsers(@Query() query: any): Promise<User[]> {
    return this.usersService.findByParams(query);
  }

  @Put(':id')
  @LogAction('UPDATE', 'Usuario actualizado exitosamente')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID to update',
    schema: { type: 'integer' },
  })
  @ApiBody({
    description: 'Partial user data to update',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token required.',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  @LogAction('DELETE', 'Usuario eliminado exitosamente')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID to delete',
    schema: { type: 'integer' },
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT token required.',
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}