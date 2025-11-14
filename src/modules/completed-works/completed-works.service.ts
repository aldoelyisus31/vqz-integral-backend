import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompletedWork } from './entities/completed-work.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CompletedWorksService {
  constructor(
    @InjectRepository(CompletedWork)
    private readonly repo: Repository<CompletedWork>,
  ) {}

  private ensureUploadsDir() {
    const dir = path.resolve(process.cwd(), 'uploads', 'completed-works');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  async saveImage(file: any | undefined): Promise<string | undefined> {
    if (!file) return undefined;

    const dir = this.ensureUploadsDir();
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return `/uploads/completed-works/${filename}`;
  }

  async create(data: any, file?: any): Promise<CompletedWork> {
    const imagePath = await this.saveImage(file);
    const work = this.repo.create({
      title: data.title,
      description: data.description,
      active: data.active ?? false,
      imagePath,
    });

    return await this.repo.save(work);
  }

  async findAllActive(): Promise<CompletedWork[]> {
    return await this.repo.find({ where: { active: true } });
  }

  async findAll(): Promise<CompletedWork[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<CompletedWork> {
    const work = await this.repo.findOne({ where: { id } });
    if (!work) throw new NotFoundException('Completed work not found');
    return work;
  }

  async update(id: number, data: any, file?: any): Promise<CompletedWork> {
    const work = await this.repo.findOne({ where: { id } });
    if (!work) throw new NotFoundException('Completed work not found');

    if (file) {
      // Remove old file if exists
      if (work.imagePath) {
        const oldPath = path.resolve(process.cwd(), '.' + work.imagePath);
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
      work.imagePath = await this.saveImage(file);
    }

    if (data.title !== undefined) work.title = data.title;
    if (data.description !== undefined) work.description = data.description;
    if (data.active !== undefined) work.active = data.active;

    return await this.repo.save(work);
  }

  async softDelete(id: number): Promise<void> {
    const work = await this.repo.findOne({ where: { id } });
    if (!work) throw new NotFoundException('Completed work not found');
    await this.repo.softDelete(id);
  }

  async restore(id: number): Promise<CompletedWork> {
    const work = await this.repo.findOne({ where: { id }, withDeleted: true });
    if (!work) throw new NotFoundException('Completed work not found');
    if (!work.deletedAt) throw new BadRequestException('Completed work is not deleted');
    await this.repo.restore(id);
    return await this.findById(id);
  }

  async findAllWithDeleted(): Promise<CompletedWork[]> {
    return await this.repo.find({ withDeleted: true });
  }

  async permanentDelete(id: number): Promise<void> {
    const work = await this.repo.findOne({ where: { id }, withDeleted: true });
    if (!work) throw new NotFoundException('Completed work not found');
    
    // Remove file
    if (work.imagePath) {
      const oldPath = path.resolve(process.cwd(), '.' + work.imagePath);
      try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
    }
    
    await this.repo.delete(id);
  }
}
