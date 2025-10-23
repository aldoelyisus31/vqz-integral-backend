import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionLog } from './entities/action-log.entity';

export interface CreateActionLogDto {
  action: string;
  textDescription: string;
  userId: number;
  endpoint: string;
  method: string;
}

@Injectable()
export class ActionLogsService {
  constructor(
    @InjectRepository(ActionLog)
    private readonly actionLogRepository: Repository<ActionLog>,
  ) {}

  async create(createActionLogDto: CreateActionLogDto): Promise<ActionLog> {
    const actionLog = this.actionLogRepository.create(createActionLogDto);
    return await this.actionLogRepository.save(actionLog);
  }

  async findAll(): Promise<ActionLog[]> {
    return await this.actionLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<ActionLog[]> {
    return await this.actionLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByAction(action: string): Promise<ActionLog[]> {
    return await this.actionLogRepository.find({
      where: { action },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
