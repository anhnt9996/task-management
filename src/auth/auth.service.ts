import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(credentials: AuthCredentialsDTO): Promise<User> | never {
    const { username, password } = credentials;

    const exists = await this.userRepository.findOne({ username });
    if (exists) {
      throw new BadRequestException(
        `Username #${username} is taken by other user.`,
      );
    }

    const hashedPassword = await hash(password.toString(), 1);
    const user = await this.userRepository.save({
      username: username,
      password: hashedPassword,
    });

    return user;
  }
}
