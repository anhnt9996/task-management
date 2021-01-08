import { HttpExceptionFilter } from 'src/Exceptions/http-filter.exception';
import { TaskStatusValidationPipe } from './pipes/status-validation.pipe';
import { BaseController } from 'src/base.controller';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { TasksService } from './tasks.service';
import { omit, pick } from 'lodash';
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
  HttpStatus,
} from '@nestjs/common';
import { TaskStatus } from './task.entity';

@Controller('tasks')
@UseFilters(HttpExceptionFilter)
export class TasksController extends BaseController {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get()
  async index() {
    const tasks = await this.tasksService.getTasks();

    return this.response(HttpStatus.OK, tasks);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateTaskDTO) {
    const task = await this.tasksService.create({
      ...pick(body, ['title', 'description']),
    });

    return this.response(HttpStatus.CREATED, task);
  }

  @Get(':uuid')
  async show(@Param('uuid') uuid: string) {
    const task = await this.tasksService.getTaskByUUID(uuid);

    return this.response(HttpStatus.OK, task);
  }

  // @Put(':uuid')
  // @UsePipes(ValidationPipe)
  // async edit(@Param('uuid') uuid: string, @Body() data: UpdateTaskDTO) {
  //   const task = await this.tasksService.update(uuid, data);
  //   return this.response(HttpStatus.OK, omit(task, 'id'));
  // }

  @Put(':uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body('nextStatus', TaskStatusValidationPipe) nextStatus: TaskStatus,
  ) {
    const task = await this.tasksService.updateStatus(uuid, nextStatus);

    return this.response(HttpStatus.OK, task);
  }

  // @Delete(':uuid')
  // async delete(@Param('uuid') uuid: string) {
  //   await this.tasksService.delete(uuid);

  //   return this.response(HttpStatus.OK, []);
  // }
}
