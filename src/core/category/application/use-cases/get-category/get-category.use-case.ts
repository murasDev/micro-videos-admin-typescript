import { Category } from '@core/category/domain/category.entity';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, Promise<GetCategoryOutput>>
{
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const id = new Uuid(input.id);
    const entity = await this.categoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundError(id, Category);
    }

    return CategoryOutputMapper.toOutput(entity);
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;
