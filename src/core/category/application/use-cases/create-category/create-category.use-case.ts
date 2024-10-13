import { Category } from '@core/category/domain/category.entity';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';
import { CreateCategoryInput } from './create-category.input';

export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, Promise<CreateCategoryOutput>>
{
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = Category.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.categoryRepository.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}

export type CreateCategoryOutput = CategoryOutput;
