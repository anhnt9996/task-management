import { HttpStatus } from '@nestjs/common';

export class BaseController {
  response<T>(code = HttpStatus.OK, data: Array<T> | T, message = '') {
    return {
      code,
      data,
      message,
    };
  }
}
