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

  transform(value: number) {
    if (!value) {
      throw new BadRequestException('nextStatus is required');
    }

    if (!this.allowedStatus.includes(value)) {
      throw new BadRequestException(`Status '${value}' is invalid`);
    }

    return value;
  }
}
