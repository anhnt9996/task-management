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
