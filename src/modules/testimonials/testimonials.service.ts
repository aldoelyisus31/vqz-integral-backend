import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly repo: Repository<Testimonial>,
  ) {}

  private ensureUploadsDir() {
    const dir = path.resolve(process.cwd(), 'uploads', 'testimonials');
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

    // return path relative to server root so it can be served from /uploads
    return `/uploads/testimonials/${filename}`;
  }

  async createAdmin(data: any, file?: any): Promise<Testimonial> {
    const imagePath = await this.saveImage(file);
    const testimonial = this.repo.create({
      name: data.name,
      description: data.description,
      active: data.active ?? false,
      stars: data.stars ?? 5,
      imagePath,
    });

    return await this.repo.save(testimonial);
  }

  async createPublic(data: any, file?: any): Promise<Testimonial> {
    const imagePath = await this.saveImage(file);
    const testimonial = this.repo.create({
      name: data.name,
      description: data.description,
      active: true, // user-submitted are active automatically per requirement
      stars: data.stars ?? 5,
      imagePath,
    });

    return await this.repo.save(testimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return await this.repo.find({ where: { deletedAt: null } });
  }

  async findAllActive(): Promise<Testimonial[]> {
    return await this.repo.find({ where: { active: true } });
  }

  async findById(id: number): Promise<Testimonial> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');
    return t;
  }

  async update(id: number, data: any, file?: any): Promise<Testimonial> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');

    if (file) {
      // remove old file if exists (best effort)
      if (t.imagePath) {
        const oldPath = path.resolve(process.cwd(), '.' + t.imagePath);
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
      t.imagePath = await this.saveImage(file);
    }

    if (data.name !== undefined) t.name = data.name;
    if (data.description !== undefined) t.description = data.description;
    if (data.active !== undefined) t.active = data.active;
    if (data.stars !== undefined) t.stars = data.stars;

    return await this.repo.save(t);
  }

  async softDelete(id: number): Promise<void> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');
    await this.repo.softDelete(id);
  }

  async restore(id: number): Promise<Testimonial> {
    const t = await this.repo.findOne({ where: { id }, withDeleted: true });
    if (!t) throw new NotFoundException('Testimonial not found');
    if (!t.deletedAt) throw new BadRequestException('Testimonial is not deleted');
    await this.repo.restore(id);
    return await this.findById(id);
  }

  async findAllWithDeleted(): Promise<Testimonial[]> {
    return await this.repo.find({ withDeleted: true });
  }

  async permanentDelete(id: number): Promise<void> {
    const t = await this.repo.findOne({ where: { id }, withDeleted: true });
    if (!t) throw new NotFoundException('Testimonial not found');
    // remove file
    if (t.imagePath) {
      const oldPath = path.resolve(process.cwd(), '.' + t.imagePath);
      try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
    }
    await this.repo.delete(id);
  }
}
