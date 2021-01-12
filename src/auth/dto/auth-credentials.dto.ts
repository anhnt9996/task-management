import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
