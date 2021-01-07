import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import { omit, pick } from 'lodash';

import { BaseController } from 'src/base.controller';
import { HttpExceptionFilter } from 'src/Exceptions/http-filter.exception';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { TaskStatusValidationPipe } from './pipes/status-validation.pipe';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseFilters(HttpExceptionFilter)
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
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateTaskDTO) {
    const task = await this.tasksService.create({
      ...pick(body, ['title', 'description']),
    });

    return this.response(
      201,
      pick(task, ['uuid', 'title', 'description', 'status', 'statusInString']),
    );
  }

  @Get(':uuid')
  show(@Param('uuid') uuid: string) {
    const task = this.tasksService.getTaskByUUID(uuid);

    return this.response(200, omit(task, 'id'));
  }

  @Put(':uuid')
  @UsePipes(ValidationPipe)
  async edit(@Param('uuid') uuid: string, @Body() data: UpdateTaskDTO) {
    const task = await this.tasksService.update(uuid, data);
    return this.response(200, omit(task, 'id'));
  }

  @Put(':uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body('nextStatus', TaskStatusValidationPipe) nextStatus: TaskStatus,
  ) {
    const task = await this.tasksService.updateStatus(uuid, nextStatus);

    return this.response(200, omit(task, 'id'));
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.tasksService.delete(uuid);

    return this.response(200, []);
  }
}
