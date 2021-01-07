import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isEmpty, omit } from 'lodash';
import { promises as fs } from 'fs';
import { v1 as uuid } from 'uuid';

import { CreateTaskDTO } from './dto/create.dto';
import { Task, TaskStatus, TaskWithStatusInString } from './task.model';
import AppConfig from '../config/app.config';
import { UpdateTaskDTO } from './dto/update.dto';

@Injectable()
export class TasksService {
  private tasks: Task[];

  constructor() {
    this.retrieve().then((tasks) => (this.tasks = tasks));
  }

  getTasks(): Task[] {
    return this.tasks.map((task) => ({
      ...task,
      statusInString: TasksService.statusToString(task.status),
    }));
  }

  async create(data: CreateTaskDTO): Promise<TaskWithStatusInString> {
    if (isEmpty(data)) {
      return;
    }

    const task: Task = {
      id: this.tasks.length + 1,
      uuid: uuid(),
      status: TaskStatus.NEW,
      ...data,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    this.tasks.push(task);

    await this.store();

    return {
      ...task,
      statusInString: TasksService.statusToString(task.status),
    };
  }

  getTaskByUUID(uuid: string): TaskWithStatusInString | never {
    const task = this.tasks.find((task) => task.uuid === uuid);

    if (!task) {
      throw new HttpException(`Not found task #${uuid}`, HttpStatus.NOT_FOUND);
    }

    return {
      ...task,
      statusInString: TasksService.statusToString(task.status),
    };
  }

  static statusToString(status: number): string | null {
    return TaskStatus[status]?.toLowerCase()?.replace('_', ' ') || null;
  }

  private async store(tasks = []): Promise<void> {
    this.tasks = isEmpty(tasks) ? this.tasks : tasks;

    await fs.writeFile(AppConfig.FILEPATH, JSON.stringify(this.tasks));
  }

  private async retrieve(): Promise<Task[]> {
    const tasks = await fs.readFile(AppConfig.FILEPATH, 'utf8');

    if (!tasks) {
      return [];
    }

    return JSON.parse(tasks);
  }

  async delete(uuid: string): Promise<boolean> {
    const indexOfTask = this.tasks.findIndex((task) => task.uuid === uuid);

    if (indexOfTask === -1) {
      throw new HttpException(`Not found task #${uuid}`, HttpStatus.NOT_FOUND);
    }

    await this.store(
      this.tasks
        .slice(0, indexOfTask)
        .concat(this.tasks.slice(indexOfTask + 1)),
    );

    return true;
  }

  async updateStatus(
    uuid: string,
    nextStatus: TaskStatus,
  ): Promise<TaskWithStatusInString> | never {
    const task = omit(this.getTaskByUUID(uuid), 'statusInString');
    const indexOfTask = this.tasks.findIndex((task) => task.uuid === uuid);

    if (task.status === nextStatus) {
      return {
        ...task,
        statusInString: TasksService.statusToString(task.status),
      };
    }

    task.status = nextStatus;
    task.updatedAt = new Date().getTime();

    const tasks = this.tasks
      .slice(0, indexOfTask)
      .concat(task)
      .concat(this.tasks.slice(indexOfTask + 1));

    await this.store(tasks);

    return {
      ...task,
      statusInString: TasksService.statusToString(task.status),
    };
  }

  async update(
    uuid: string,
    data: UpdateTaskDTO,
  ): Promise<TaskWithStatusInString> | never {
    const task = omit(this.getTaskByUUID(uuid), 'statusInString');
    const indexOfTask = this.tasks.findIndex((task) => task.uuid === uuid);

    if (isEmpty(data)) {
      return {
        ...task,
        statusInString: TasksService.statusToString(task.status),
      };
    }

    task.title = data['title'] || task.title;
    task.description = data['description'] || task.description;
    task.updatedAt = new Date().getTime();

    const tasks = this.tasks
      .slice(0, indexOfTask)
      .concat(task)
      .concat(this.tasks.slice(indexOfTask + 1));

    await this.store(tasks);

    return {
      ...task,
      statusInString: TasksService.statusToString(task.status),
    };
  }
}
