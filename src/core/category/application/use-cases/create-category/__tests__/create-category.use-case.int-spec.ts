import { CategorySequelizeRepository } from '@core/category/infrastructure/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/category/infrastructure/db/sequelize/category.model';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '@core/shared/infrastructure/testing/helpers';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);

    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category with name', async () => {
    const output = await useCase.execute({ name: 'test' });

    const item = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: item?.category_id.toString(),
      name: item?.name,
      description: item?.description,
      is_active: item?.is_active,
      created_at: item?.created_at,
    });
  });

  it('should create a category with name, description and is_active', async () => {
    const output = await useCase.execute({
      name: 'test',
      description: 'description',
      is_active: false,
    });

    const item = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: item?.category_id.toString(),
      name: item?.name,
      description: item?.description,
      is_active: item?.is_active,
      created_at: item?.created_at,
    });
  });
});
