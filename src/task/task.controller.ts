import { HttpExceptionFilter } from '../Exceptions/http-filter.exception';
import { TaskStatusValidationPipe } from './pipes/status-validation.pipe';
import { BodyWithUser } from '../auth/decorators/user-body.decorator';
import { IAuthUSer } from '../auth/interfaces/auth-user.interface';
import { GetUser } from '../auth/decorators/auth-user.decorator';
import { BaseController } from '../base.controller';
import { CreateTaskDTO } from './dto/create.dto';
import { UpdateTaskDTO } from './dto/update.dto';
import { TasksService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from './dto/filter.dto';
import { User } from '../user/user.entity';
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
  async index(@Query() query: FilterDto, @GetUser() user: User) {
    const tasks = await this.tasksService.getTasks(query, user);

    return this.response(tasks);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ validateCustomDecorators: true }))
  async create(
    @BodyWithUser()
    body: CreateTaskDTO & { user: IAuthUSer },
  ) {
    const task = await this.tasksService.create({
      ...pick(body, ['title', 'description', 'user']),
    });

    return this.response(task);
  }

  @Get(':uuid')
  async show(@Param('uuid') uuid: string, @GetUser() user: User) {
    const task = await this.tasksService.getTaskByUUID(uuid, user);

    return this.response(task);
  }

  @Put(':uuid')
  @UsePipes(ValidationPipe)
  async edit(
    @Param('uuid') uuid: string,
    @Body() data: UpdateTaskDTO,
    @GetUser() user: User,
  ) {
    const task = await this.tasksService.update(uuid, data, user);

    return this.response(omit(task, 'id'));
  }

  @Put(':uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body('nextStatus', ParseIntPipe, TaskStatusValidationPipe)
    nextStatus: TaskStatus,
    @GetUser() user: User,
  ) {
    const task = await this.tasksService.updateStatus(uuid, nextStatus, user);

    return this.response(task);
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @GetUser() user: User) {
    await this.tasksService.delete(uuid, user);

    return this.response([]);
  }
}
