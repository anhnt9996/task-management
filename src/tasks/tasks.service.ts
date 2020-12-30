import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  getTasks(): Task[] {
    return this.tasks.map((task) => {
      const status: string = TaskStatus[task.status];
      task.status = (status as unknown) as TaskStatus;
      return task;
    });
  }

  create(data: any): Task {
    const task: Task = {
      id: this.tasks.length + 1,
      status: TaskStatus.NEW,
      ...data,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };

    this.tasks.push(task);

    return task;
  }
}
