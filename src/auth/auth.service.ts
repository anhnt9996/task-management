import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(credentials: AuthCredentialsDTO): Promise<User> | never {
    const { username, password } = credentials;

    const exists = await this.userRepository.findOne({ username });
    if (exists) {
      throw new ConflictException(
        `Username #${username} is taken by other user.`,
      );
    }

    const salt = await genSalt();
    const hashedPassword = await hash(password.toString(), salt);
    const user = await this.userRepository.save({
      username: username,
      password: hashedPassword,
      salt: salt,
    });

    return user;
  }

  async signIn(
    credentials: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> | never {
    await this.userRepository.validateUserAndPassword(
      credentials.username,
      credentials.password,
    );

    const payload: IJwtPayload = {
      username: credentials.username,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
