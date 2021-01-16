import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BodyWithUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      ...request.body,
      auth: request.user,
    };
  },
);
