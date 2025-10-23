import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { FilterUserTypeDto } from './dto/filter-user-type.dto';
import { UserType } from './entities/user-type.entity';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  async create(createUserTypeDto: CreateUserTypeDto): Promise<UserType> {
    // Verificar si ya existe un tipo de usuario con ese nombre
    const existingType = await this.userTypeRepository.findOne({
      where: { typeName: createUserTypeDto.typeName },
    });

    if (existingType) {
      throw new ConflictException(
        `El tipo de usuario '${createUserTypeDto.typeName}' ya existe`
      );
    }

    const userType = this.userTypeRepository.create(createUserTypeDto);
    return await this.userTypeRepository.save(userType);
  }

  async findAll(): Promise<UserType[]> {
    return await this.userTypeRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<UserType> {
    const userType = await this.userTypeRepository.findOne({
      where: { id },
    });

    if (!userType) {
      throw new NotFoundException(`Tipo de usuario con ID ${id} no encontrado`);
    }

    return userType;
  }

  async findByParams(filterDto: FilterUserTypeDto): Promise<UserType[]> {
    const where: any = {};

    if (filterDto.id) {
      where.id = parseInt(filterDto.id);
    }

    if (filterDto.typeName) {
      where.typeName = ILike(`%${filterDto.typeName}%`);
    }

    return await this.userTypeRepository.find({
      where,
      order: { id: 'ASC' },
    });
  }

  async update(id: number, updateUserTypeDto: UpdateUserTypeDto): Promise<UserType> {
    // Verificar que el tipo de usuario existe
    const userType = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
    if (updateUserTypeDto.typeName && updateUserTypeDto.typeName !== userType.typeName) {
      const existingType = await this.userTypeRepository.findOne({
        where: { typeName: updateUserTypeDto.typeName },
      });

      if (existingType) {
        throw new ConflictException(
          `El tipo de usuario '${updateUserTypeDto.typeName}' ya existe`
        );
      }
    }

    // Actualizar el tipo de usuario
    await this.userTypeRepository.update(id, updateUserTypeDto);

    // Retornar el tipo de usuario actualizado
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const userType = await this.findOne(id);

    // Verificar si hay usuarios con este tipo (opcional, dependiendo de tu lógica)
    // Si quieres evitar eliminar tipos que están en uso, puedes agregar esa validación aquí

    await this.userTypeRepository.remove(userType);
  }

  async checkTypeNameConflict(typeName: string, excludeId?: number): Promise<UserType | null> {
    const query = this.userTypeRepository.createQueryBuilder('userType')
      .where('LOWER(userType.typeName) = LOWER(:typeName)', { typeName });

    if (excludeId) {
      query.andWhere('userType.id != :excludeId', { excludeId });
    }

    return await query.getOne();
  }
}
