import { HttpExceptionFilter } from 'src/Exceptions/http-filter.exception';
import { TaskStatusValidationPipe } from './pipes/status-validation.pipe';
import { BaseController } from 'src/base.controller';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { TasksService } from './task.service';
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
  Query,
} from '@nestjs/common';
import { TaskStatus } from './task.entity';
import { FilterDto } from './dto/filter.dto';

@Controller('tasks')
@UseFilters(HttpExceptionFilter)
export class TasksController extends BaseController {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get()
  async index(@Query() query: FilterDto) {
    const tasks = await this.tasksService.getTasks(query);

    return this.response(undefined, tasks);
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

    return this.response(undefined, task);
  }

  @Put(':uuid')
  @UsePipes(ValidationPipe)
  async edit(@Param('uuid') uuid: string, @Body() data: UpdateTaskDTO) {
    const task = await this.tasksService.update(uuid, data);

    return this.response(undefined, omit(task, 'id'));
  }

  @Put(':uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body('nextStatus', TaskStatusValidationPipe)
    nextStatus: TaskStatus,
  ) {
    const task = await this.tasksService.updateStatus(uuid, nextStatus);

    return this.response(undefined, task);
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.tasksService.delete(uuid);

    return this.response(undefined, []);
  }
}
