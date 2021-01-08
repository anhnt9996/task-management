import { Task, TaskStatus } from './task.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { isEmpty, omit } from 'lodash';
import { TaskResponse } from './task.response';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(): Promise<TaskResponse[]> {
    const tasks = await this.taskRepository.find();

    return tasks.map((task) => this.transformTask(task));
  }

  async create(data: CreateTaskDTO): Promise<TaskResponse> {
    if (isEmpty(data)) {
      return;
    }

    const task = await this.taskRepository.save({
      ...data,
    });

    return this.transformTask(task);
  }

  async getTaskByUUID(uuid: string): Promise<TaskResponse> | never {
    const task = await this.taskRepository.findOne({ uuid });

    if (!task) {
      throw new HttpException(`Not found task #${uuid}`, HttpStatus.NOT_FOUND);
    }

    return this.transformTask(task);
  }

  static statusToString(status: number): string | null {
    return TaskStatus[status]?.toLowerCase()?.replace('_', ' ') || null;
  }

  private transformTask(task: Task): TaskResponse {
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

  // async delete(uuid: string): Promise<boolean> {
  //   const indexOfTask = this.tasks.findIndex((task) => task.uuid === uuid);
  //   if (indexOfTask === -1) {
  //     throw new HttpException(`Not found task #${uuid}`, HttpStatus.NOT_FOUND);
  //   }
  //   await this.store(
  //     this.tasks
  //       .slice(0, indexOfTask)
  //       .concat(this.tasks.slice(indexOfTask + 1)),
  //   );
  //   return true;
  // }

  async updateStatus(
    uuid: string,
    nextStatus: TaskStatus,
  ): Promise<TaskResponse> | never {
    await this.taskRepository.update({ uuid }, { status: nextStatus });

    return this.getTaskByUUID(uuid);
  }

  // async update(
  //   uuid: string,
  //   data: UpdateTaskDTO,
  // ): Promise<TaskResponse> | never {
  //   const task = omit(this.getTaskByUUID(uuid), 'statusInString');
  //   const indexOfTask = this.tasks.findIndex((task) => task.uuid === uuid);
  //   if (isEmpty(data)) {
  //     return {
  //       ...task,
  //       statusInString: TasksService.statusToString(task.status),
  //     };
  //   }
  //   task.title = data['title'] || task.title;
  //   task.description = data['description'] || task.description;
  //   task.updatedAt = new Date().getTime();
  //   const tasks = this.tasks
  //     .slice(0, indexOfTask)
  //     .concat(task)
  //     .concat(this.tasks.slice(indexOfTask + 1));
  //   await this.store(tasks);
  //   return {
  //     ...task,
  //     statusInString: TasksService.statusToString(task.status),
  //   };
  // }
}
