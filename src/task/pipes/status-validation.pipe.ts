import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.entity';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.NEW,
    TaskStatus.CLOSED,
    TaskStatus.COMPLETED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.PENDING,
  ];

  transform(value: any) {
    if (!this.allowedStatus.includes(parseInt(value))) {
      throw new BadRequestException(`Status '${value}' is invalid`);
    }

    return value;
  }
}
