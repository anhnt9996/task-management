import { TasksController } from './task.controller';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
