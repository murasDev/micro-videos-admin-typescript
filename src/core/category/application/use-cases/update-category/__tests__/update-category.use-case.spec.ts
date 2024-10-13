import { Category } from '@core/category/domain/category.entity';
import { CategoryInMemoryRepository } from '@core/category/infrastructure/db/in-memory/category-in-memory.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid.vo';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throws error when entity is invalid', async () => {
    const category = new Category({ name: 'Movie' });

    await repository.insert(category);

    await expect(() =>
      useCase.execute({ id: category.category_id.id, name: 'r'.repeat(256) }),
    ).rejects.toThrow(EntityValidationError);
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new Category({ name: 'Movie' });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: 'test',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          is_active: true,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description! }),
        ...('is_active' in i.input && { is_active: i.input.is_active }),
      });
      expect(output).toStrictEqual({
        id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
