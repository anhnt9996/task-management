import { TaskStatus } from '../task.entity';

export class FilterDto {
  status: TaskStatus;
  searchText: string;
}
