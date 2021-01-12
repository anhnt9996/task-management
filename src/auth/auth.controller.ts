import { omit, pick } from 'lodash';
import { AuthService } from './auth.service';
import { BaseController } from 'src/base.controller';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { HttpExceptionFilter } from 'src/Exceptions/http-filter.exception';
import {
  Body,
  Controller,
  Post,
  HttpStatus,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('')
@UseFilters(HttpExceptionFilter)
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  async signUp(@Body() body: AuthCredentialsDTO) {
    const user = await this.authService.signUp(
      pick(body, ['username', 'password']),
    );

    return this.response(HttpStatus.CREATED, omit(user, 'id'));
  }
}
