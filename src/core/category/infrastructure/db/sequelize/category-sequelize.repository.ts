import { Category } from '@core/category/domain/category.entity';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '@core/category/domain/category.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Op } from 'sequelize';
import { CategoryModelMapper } from './category-model-mapper';
import { CategoryModel } from './category.model';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [['created_at', 'desc']] }),
      offset,
      limit,
    });
    return new CategorySearchResult({
      items: models.map((model) => {
        return CategoryModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(model.toJSON());
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.toString();
    const model = await this._get(entity.category_id.toString());

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelToUpdate = CategoryModelMapper.toModel(entity);

    await this.categoryModel.update(modelToUpdate.toJSON(), {
      where: { category_id: id },
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON(),
    );

    await this.categoryModel.bulkCreate(models);
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.toString();
    const model = await this._get(entity_id.toString());

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.destroy({ where: { category_id: id } });
  }

  async findById(eity_id: Uuid): Promise<Category | null> {
    const model = await this._get(eity_id.toString());

    if (!model) {
      return null;
    }

    return CategoryModelMapper.toEntity(model);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
