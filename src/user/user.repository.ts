import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async validateUserAndPassword(
    username: string,
    password: string,
  ): Promise<User> | never {
    const user = await this.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      throw new BadRequestException(
        `Username or password does not match with our credentials`,
      );
    }

    return user;
  }
}
