import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Generated,
  Column,
  Entity,
  DeleteDateColumn,
} from 'typeorm';

export enum TaskStatus {
  NEW = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CLOSED = 4,
  PENDING = 99,
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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
