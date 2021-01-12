import { IsOptional, MinLength } from 'class-validator';

export class UpdateTaskDTO {
  @MinLength(6)
  @IsOptional()
  title: string;

  @MinLength(6)
  @IsOptional()
  description: string;
}
