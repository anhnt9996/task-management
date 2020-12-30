import { IResponse } from './interfaces/response.interface';

export class BaseController {
  response<T>(code = 200, data: Array<T> | T, message = ''): IResponse {
    return {
      code,
      data,
      message,
    };
  }
}
