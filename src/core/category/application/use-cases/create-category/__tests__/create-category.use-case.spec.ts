import { CategoryInMemoryRepository } from '@core/category/infrastructure/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();

    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category with name', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');

    const output = await useCase.execute({ name: 'test' });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].category_id.toString(),
      name: 'test',
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });

  it('should throw an error when aggregate is not valid', async () => {
    const input = { name: 't'.repeat(256) };
    await expect(() => useCase.execute(input)).rejects.toThrowError(
      'Entity Validation Error',
    );
  });

  it('should create a category with name, description and is_active', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');

    const output = await useCase.execute({
      name: 'test',
      description: 'description',
      is_active: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].category_id.toString(),
      name: 'test',
      description: 'description',
      is_active: false,
      created_at: repository.items[0].created_at,
    });
  });
});
