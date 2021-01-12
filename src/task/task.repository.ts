import { Brackets, EntityRepository, Repository } from 'typeorm';
import { FilterDto } from './dto/filter.dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterData: FilterDto): Promise<Task[]> {
    const { status, searchText } = filterData;
    const query = this.createQueryBuilder('tasks');

    if (status) {
      query.andWhere('tasks.status = :status', { status: status });
    }

    if (searchText) {
      query.andWhere(
        new Brackets((subQuery) => {
          subQuery.andWhere(
            'tasks.title LIKE :searchText ' +
              'OR tasks.description LIKE :searchText',
            {
              searchText: `%${searchText}%`,
            },
          );
        }),
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
