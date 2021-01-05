import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { omit, pick } from 'lodash';

import { BaseController } from 'src/base.controller';
import { IResponse } from 'src/interfaces/response.interface';
import { CreateTaskDTO } from './dto/create.dto';
import { TasksService } from './tasks.service';

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
  create(@Body() body: CreateTaskDTO): IResponse {
    const task = {
      ...pick(body, ['title', 'description']),
    };

    return this.response(
      200,
      pick(this.tasksService.create(task), [
        'uuid',
        'title',
        'description',
        'status',
        'status_in_string',
      ]),
    );
  }

  @Get(':id')
  show(@Param('id') taskId: string): IResponse {
    const task = this.tasksService.detail(taskId);
    return this.response(200, omit(task, 'id'));
  }
}
