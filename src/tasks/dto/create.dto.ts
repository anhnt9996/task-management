import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTaskDTO {
  @MinLength(6)
  @IsNotEmpty()
  title: string;

  @MinLength(6)
  @IsNotEmpty()
  description: string;
}
