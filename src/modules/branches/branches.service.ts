import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly repo: Repository<Branch>,
  ) {}

  async create(data: CreateBranchDto): Promise<Branch> {
    const branch = this.repo.create(data);
    return await this.repo.save(branch);
  }

  async findAll(): Promise<Branch[]> {
    return await this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Branch> {
    const branch = await this.repo.findOne({ where: { id } });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(id: number, data: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findById(id);
    
    if (data.name !== undefined) branch.name = data.name;
    if (data.address !== undefined) branch.address = data.address;
    if (data.latitude !== undefined) branch.latitude = data.latitude;
    if (data.longitude !== undefined) branch.longitude = data.longitude;

    return await this.repo.save(branch);
  }

  async delete(id: number): Promise<void> {
    const branch = await this.findById(id);
    await this.repo.remove(branch);
  }
}
