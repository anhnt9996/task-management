import { TaskStatus } from '../task.entity';

export interface ITaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  statusInString: string;
  createdAt: Date;
  updatedAt: Date;
}
