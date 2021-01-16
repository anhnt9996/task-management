import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ITaskResponse } from './interfaces/task.response';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { Task, TaskStatus } from './task.entity';
import { FilterDto } from './dto/filter.dto';
import { isEmpty, pick } from 'lodash';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(query: FilterDto): Promise<ITaskResponse[]> {
    const tasks = await this.taskRepository.getTasks(query);

    return tasks.map((task) => this.transformTask(task));
  }

  async create(data: CreateTaskDTO): Promise<ITaskResponse> {
    if (isEmpty(data)) {
      return;
    }

    const task = await this.taskRepository.save(data);

    return this.transformTask(task);
  }

  async getTaskByUUID(uuid: string): Promise<ITaskResponse> | never {
    const task = await this.taskRepository.findOne({ uuid });

    if (!task) {
      throw new HttpException(`Not found task #${uuid}`, HttpStatus.NOT_FOUND);
    }

    return this.transformTask(task);
  }

  static statusToString(status: number): string | null {
    return TaskStatus[status]?.toLowerCase()?.replace('_', ' ') || null;
  }

  private transformTask(task: Task): ITaskResponse {
    return {
      id: task.uuid,
      title: task.title,
      description: task.description,
      status: task.status,
      statusInString: TasksService.statusToString(task.status),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async delete(uuid: string): Promise<boolean | never> {
    await this.getTaskByUUID(uuid);

    this.taskRepository.softDelete({ uuid });

    return true;
  }

  async updateStatus(
    uuid: string,
    status: TaskStatus,
  ): Promise<ITaskResponse | never> {
    await this.taskRepository.update({ uuid }, { status });

    return this.getTaskByUUID(uuid);
  }

  async update(
    uuid: string,
    data: UpdateTaskDTO,
  ): Promise<ITaskResponse | never> {
    await this.taskRepository.update(
      { uuid },
      pick(data, ['title', 'description']),
    );

    return this.getTaskByUUID(uuid);
  }
}
