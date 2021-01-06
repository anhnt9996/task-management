import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { omit, pick } from 'lodash';

import { BaseController } from 'src/base.controller';
import { CreateTaskDTO } from './dto/create.dto';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController extends BaseController {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get()
  index() {
    const tasks = this.tasksService.getTasks();
    return this.response(
      200,
      tasks.map((task) => omit(task, 'id')),
    );
  }

  @Post()
  async create(@Body() body: CreateTaskDTO) {
    const task = await this.tasksService.create({
      ...pick(body, ['title', 'description']),
    });

    return this.response(
      200,
      pick(task, ['uuid', 'title', 'description', 'status', 'statusInString']),
    );
  }

  @Get(':uuid')
  show(@Param('uuid') uuid: string) {
    const task = this.tasksService.detail(uuid);

    if (!task) {
      return this.response(404, {});
    }

    return this.response(200, omit(task, 'id'));
  }

  @Put(':uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body('nextStatus') nextStatus: TaskStatus,
  ) {
    const task = await this.tasksService.updateStatus(uuid, nextStatus);

    if (!task) {
      return this.response(404, {});
    }

    return this.response(200, omit(task, 'id'));
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    const isDeleteSuccess = await this.tasksService.delete(uuid);

    if (!isDeleteSuccess) {
      return this.response(400, [], 'Failed to delete');
    }

    return this.response(200, []);
  }
}
