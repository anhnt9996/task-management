export class BaseController {
  response<T>(code = 200, data: Array<T> | T, message = '') {
    return {
      code,
      data,
      message,
    };
  }
}
