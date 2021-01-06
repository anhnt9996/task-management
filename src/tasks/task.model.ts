export enum TaskStatus {
  NEW = 1,
  IN_PROGRESS = 2,
  PENDING = 3,
  COMPLETED = 4,
  CLOSED = 5,
}

export interface Task {
  readonly id: number;
  readonly uuid: string;
  title: string;
  description: string;
  status: TaskStatus;
  readonly createdAt: number;
  updatedAt: number;
}

export interface TaskWithStatusInString extends Task {
  statusInString: string;
}
