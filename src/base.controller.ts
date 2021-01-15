import { HttpStatus } from '@nestjs/common';

export class BaseController {
  response<T>(data: Array<T> | T, code = HttpStatus.OK, message = '') {
    return {
      code,
      data,
      message,
    };
  }
}
