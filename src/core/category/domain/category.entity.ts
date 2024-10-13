import { Entity } from '@core/shared/domain/entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import ValueObject from '@core/shared/domain/value-objects/value-object';
import { CategoryFakeBuilder } from './category-fake.builder';
import { CategoryValidatorFactory } from './category.validator';

export type CategoryConstructorProps = {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Category extends Entity {
  category_id: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.category_id = props.category_id || new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  get entity_id(): ValueObject {
    return this.category_id;
  }

  static create(props: CategoryCreateCommand): Category {
    const category = new Category(props);

    category.validate(['name']);
    return category;
  }

  get getCategoryId() {
    return this.category_id;
  }

  get getName() {
    this.validate(['name']);
    return this.name;
  }

  get getDescription() {
    return this.description;
  }

  get getIsActive() {
    return this.is_active;
  }

  get getCreatedAt() {
    return this.created_at;
  }

  changeName(name: string) {
    this.name = name;
    this.validate(['name']);
  }

  changeDescription(description: string) {
    this.description = description;
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
