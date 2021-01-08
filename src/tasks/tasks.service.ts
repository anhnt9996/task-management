import { Task, TaskStatus, TaskWithStatusInString } from './task.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { isEmpty, omit } from 'lodash';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(): Promise<TaskWithStatusInString[]> {
    const tasks = await this.taskRepository.find();

    return tasks;

    /** 
       * Type '{ statusInString: string; length: number; toString(): string; toLocaleString(): string; pop(): Task; push(...items: Task[]): number; concat(...items: ConcatArray<Task>[]): Task[]; concat(...items: (Task | ConcatArray<...>)[]): Task[]; ... 25 more ...; includes(searchElement: Task, fromIndex?: number): boolean; }[]' is not assignable to type 'TaskWithStatusInString[]'.
    Type '{ statusInString: string; length: number; toString(): string; toLocaleString(): string; pop(): Task; push(...items: Task[]): number; concat(...items: ConcatArray<Task>[]): Task[]; concat(...items: (Task | ConcatArray<...>)[]): Task[]; ... 25 more ...; includes(searchElement: Task, fromIndex?: number): boolean; }' is missing the following properties from type 'TaskWithStatusInString': id, uuid, title, description, and 9 more.ts(2322)
     */
    // return tasks.map((task) => {
    //   return {
    //     ...tasks,
    //     statusInString: TasksService.statusToString(task.status),
    //   };
    // });
  }

  // async create(data: CreateTaskDTO): Promise<TaskWithStatusInString> {
  //   if (isEmpty(data)) {
  //     return;
  //   }
  //   const task: Task = {
  //     id: this.tasks.length + 1,
  //     uuid: uuid(),
  //     status: TaskStatus.NEW,
  //     ...data,
  //     createdAt: new Date().getTime(),
  //     updatedAt: new Date().getTime(),
  //   };
  //   this.tasks.push(task);
  //   await this.store();
  //   return {
  //     ...task,
  //     statusInString: TasksService.statusToString(task.status),
  //   };
  // }

  async getTaskByUUID(uuid: string): Promise<TaskWithStatusInString> | never {
    const task = await this.taskRepository.findOne({ uuid });

    if (!task) {
      throw new HttpException(`Not found task #${uuid}`, HttpStatus.NOT_FOUND);
    }

    return task;
  }

  static statusToString(status: number): string | null {
    return TaskStatus[status]?.toLowerCase()?.replace('_', ' ') || null;
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

  // async updateStatus(
  //   uuid: string,
  //   nextStatus: TaskStatus,
  // ): Promise<TaskWithStatusInString> | never {
  //   const task = omit(this.getTaskByUUID(uuid), 'statusInString');
  //   const indexOfTask = this.tasks.findIndex((task) => task.uuid === uuid);
  //   if (task.status === nextStatus) {
  //     return {
  //       ...task,
  //       statusInString: TasksService.statusToString(task.status),
  //     };
  //   }
  //   task.status = nextStatus;
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

  // async update(
  //   uuid: string,
  //   data: UpdateTaskDTO,
  // ): Promise<TaskWithStatusInString> | never {
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
