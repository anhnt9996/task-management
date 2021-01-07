import { HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.NEW,
    TaskStatus.CLOSED,
    TaskStatus.COMPLETED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.PENDING,
  ];

  transform(value) {
    if (!this.allowedStatus.includes(parseInt(value))) {
      throw new HttpException(
        `Status '${value}' is invalid`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
