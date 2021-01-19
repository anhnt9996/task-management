import { hash } from 'bcryptjs';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  Entity,
  Unique,
  OneToMany,
} from 'typeorm';
import { Task } from '../task/task.entity';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await hash(password, this.salt);

    return hashedPassword === this.password;
  }
}
