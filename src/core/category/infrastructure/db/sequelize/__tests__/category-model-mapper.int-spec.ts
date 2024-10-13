import { Category } from '@core/category/domain/category.entity';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '@core/shared/infrastructure/testing/helpers';
import { CategoryModelMapper } from '../category-model-mapper';
import { CategoryModel } from '../category.model';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should throws error when category is invalid', () => {
    expect.assertions(2);
    const model = CategoryModel.build({
      category_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'a'.repeat(256),
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail(
        'The category is valid, but it needs throws a EntityValidationError',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  it('should convert a category model to a category aggregate', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        description: 'some description',
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });

  test('should convert a category aggregate to a category model', () => {
    const created_at = new Date();
    const aggregate = new Category({
      category_id: new Uuid('5490020a-e866-4229-9adc-aa44b83234c4'),
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
    const model = CategoryModelMapper.toModel(aggregate);
    expect(model.toJSON()).toStrictEqual({
      category_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
  });
});
