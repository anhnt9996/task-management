import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  NEW = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CLOSED = 4,
  PENDING = 99,
}

export interface TaskWithStatusInString extends Task {
  statusInString?: string;
}

@Entity('tasks')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NEW,
  })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
