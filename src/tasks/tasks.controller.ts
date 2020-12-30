import { Controller, Get, Post } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { IResponse } from 'src/interfaces/response.interface';
import { TasksService } from './tasks.service';

interface CreateTaskDTO {
  title: string;
  description: string;
}

@Controller('tasks')
export class TasksController extends BaseController {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get()
  index(): IResponse {
    return this.response(200, this.tasksService.getTasks());
  }

  @Post()
  create(): IResponse {
    const task: CreateTaskDTO = {
      title: 'test',
      description: 'test',
    };

    return this.response(200, this.tasksService.create(task));
  }
}
