import { HttpExceptionFilter } from '../Exceptions/http-filter.exception';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { BaseController } from '../base.controller';
import { AuthService } from './auth.service';
import { omit, pick } from 'lodash';
import {
  ValidationPipe,
  Controller,
  HttpStatus,
  UseFilters,
  UsePipes,
  Body,
  Post,
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

    return this.response(
      omit(user, 'id', 'salt', 'password'),
      HttpStatus.CREATED,
    );
  }

  @Post('sign-in')
  @UsePipes(ValidationPipe)
  async signIn(@Body() body: AuthCredentialsDTO) {
    const accessToken = await this.authService.signIn(
      pick(body, ['username', 'password']),
    );

    return this.response(accessToken);
  }
}
