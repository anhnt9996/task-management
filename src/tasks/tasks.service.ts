import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { promises as fs } from 'fs';
import { v1 as uuid } from 'uuid';

import { CreateTaskDTO } from './dto/create.dto';
import { Task, TaskStatus } from './task.model';
import AppConfig from '../config/app.config';

@Injectable()
export class TasksService {
  private tasks: Task[];

  constructor() {
    this.retrieve().then((tasks) => (this.tasks = tasks));
  }

  getTasks(): Task[] {
    return this.tasks.map((task) => {
      task['status_in_string'] = TasksService.statusToString(task.status);

      return task;
    });
  }

  create(data: CreateTaskDTO): Task {
    if (isEmpty(data)) {
      return;
    }

    const task: Task = {
      id: this.tasks.length + 1,
      uuid: uuid(),
      status: TaskStatus.NEW,
      ...data,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    this.tasks.push(task);
    this.store();
    task['status_in_string'] = TasksService.statusToString(task.status);

    return task;
  }

  detail(uuid: string): Task {
    const task = this.tasks.find((task) => task.uuid === uuid);

    if (task) {
      task['status_in_string'] = TasksService.statusToString(task.status);
    }

    return task;
  }

  static statusToString(status: number): string | null {
    return TaskStatus[status].toLowerCase().replace('_', ' ') || null;
  }

  private async store(): Promise<void> {
    await fs.writeFile(AppConfig.FILEPATH, JSON.stringify(this.tasks));
  }

  private async retrieve(): Promise<Task[]> {
    const tasks = await fs.readFile(AppConfig.FILEPATH, 'utf8');

    return JSON.parse(tasks);
  }
}
