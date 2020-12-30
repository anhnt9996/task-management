export enum TaskStatus {
  NEW = 1,
  IN_PROGRESS = 2,
  PENDING = 3,
  COMPLETED = 4,
  CLOSED = 5,
}

export interface Task {
  readonly id: number;
  title: string;
  description: string;
  status: TaskStatus;
  readonly created_at: number;
  updated_at: number;
}
