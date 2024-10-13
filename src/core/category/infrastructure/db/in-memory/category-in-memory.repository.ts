import { Category } from '@core/category/domain/category.entity';
import {
  CategoryFilter,
  ICategoryRepository,
} from '@core/category/domain/category.repository';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '@core/shared/infrastructure/db/in-memory/in-memory.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements ICategoryRepository
{
  sortableFields = ['name', 'created_at'];

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter | null,
  ): Promise<Category[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
    );
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
