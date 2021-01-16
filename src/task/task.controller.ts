import { HttpExceptionFilter } from 'src/Exceptions/http-filter.exception';
import { TaskStatusValidationPipe } from './pipes/status-validation.pipe';
import { BodyWithUser } from 'src/auth/decorators/user-body.decorator';
import { IAuthUSer } from 'src/auth/interfaces/auth-user.interface';
import { BaseController } from 'src/base.controller';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { TasksService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from './dto/filter.dto';
import { TaskStatus } from './task.entity';
import { omit, pick } from 'lodash';
import {
  ValidationPipe,
  UseFilters,
  Controller,
  UseGuards,
  HttpCode,
  UsePipes,
  Delete,
  Param,
  Query,
  Post,
  Body,
  Get,
  Put,
  ParseIntPipe,
} from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
@UseFilters(HttpExceptionFilter)
export class TasksController extends BaseController {
  constructor(private tasksService: TasksService) {
    super();
  }

  @Get()
  async index(@Query() query: FilterDto) {
    const tasks = await this.tasksService.getTasks(query);

    return this.response(tasks);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ validateCustomDecorators: true }))
  async create(
    @BodyWithUser()
    body: CreateTaskDTO & { auth: IAuthUSer },
  ) {
    const task = await this.tasksService.create({
      ...pick(body, ['title', 'description']),
    });

    return this.response(task);
  }

  @Get(':uuid')
  async show(@Param('uuid') uuid: string) {
    const task = await this.tasksService.getTaskByUUID(uuid);

    return this.response(task);
  }

  @Put(':uuid')
  @UsePipes(ValidationPipe)
  async edit(@Param('uuid') uuid: string, @Body() data: UpdateTaskDTO) {
    const task = await this.tasksService.update(uuid, data);

    return this.response(omit(task, 'id'));
  }

  @Put(':uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body('nextStatus', ParseIntPipe, TaskStatusValidationPipe)
    nextStatus: TaskStatus,
  ) {
    const task = await this.tasksService.updateStatus(uuid, nextStatus);

    return this.response(task);
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.tasksService.delete(uuid);

    return this.response([]);
  }
}
