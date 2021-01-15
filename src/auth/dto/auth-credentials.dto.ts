import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
