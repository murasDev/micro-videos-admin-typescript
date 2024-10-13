import { Category } from '@core/category/domain/category.entity';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';
import { UpdateCategoryInput } from './update-category.input';

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, Promise<UpdateCategoryOutput>>
{
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    if ('description' in input) {
      category.changeDescription(input.description!);
    }

    if (input.is_active === true) {
      category.activate();
    }

    if (input.is_active === false) {
      category.deactivate();
    }

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.categoryRepository.update(category);

    return CategoryOutputMapper.toOutput(category);
  }
}

export type UpdateCategoryOutput = CategoryOutput;
