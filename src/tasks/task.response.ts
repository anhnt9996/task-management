import { TaskStatus } from './task.entity';

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  statusInString: string;
  createdAt: Date;
  updatedAt: Date;
}
