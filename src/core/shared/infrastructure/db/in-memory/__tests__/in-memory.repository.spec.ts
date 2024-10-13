import { Entity } from '@core/shared/domain/entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  readonly entity_id: Uuid;
  readonly name: string;
  readonly price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id ?? new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.toString(),
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

  constructor() {
    super();
  }
}

describe('InMemoryRepository Unit Test', () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  it('should insert entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    expect(repo.items).toHaveLength(1);
    expect(repo.items[0]).toBe(entity);
  });

  it('should update entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    const entity2 = new StubEntity({
      entity_id: new Uuid(),
      name: 'Testa',
      price: 900,
    });

    const entity3 = new StubEntity({
      entity_id: new Uuid(),
      name: 'Testaasd',
      price: 899,
    });

    await repo.bulkInsert([entity, entity2, entity3]);

    expect(repo.items).toHaveLength(3);
  });

  it('should returns all entities', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    const entity2 = new StubEntity({
      entity_id: new Uuid(),
      name: 'Testa',
      price: 900,
    });

    const entity3 = new StubEntity({
      entity_id: new Uuid(),
      name: 'Testaasd',
      price: 899,
    });

    await repo.bulkInsert([entity, entity2, entity3]);

    const entities = await repo.findAll();

    expect(entities).toHaveLength(3);
  });

  it('should insert many entities', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    const entity2 = new StubEntity({
      entity_id: new Uuid(),
      name: 'Testa',
      price: 900,
    });

    const entity3 = new StubEntity({
      entity_id: new Uuid(),
      name: 'Testaasd',
      price: 899,
    });

    await repo.bulkInsert([entity, entity2, entity3]);

    expect(repo.items).toHaveLength(3);
  });

  it('should find entity by id', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    const foundEntity = await repo.findById(entity.entity_id);

    expect(foundEntity).toBe(entity);
  });

  it('should delete entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    await repo.insert(entity);

    expect(repo.items).toHaveLength(1);
    await repo.delete(entity.entity_id);
    expect(repo.items).toHaveLength(0);
  });

  it('should throw error when delete and entity not found', async () => {
    const uuidMocked = new Uuid();

    await expect(repo.delete(uuidMocked)).rejects.toThrow(NotFoundError);
  });

  it('should throw error when update and entity not found', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    });

    const entity2 = new StubEntity({
      name: 'Claudiio',
      price: 100,
    });

    await repo.insert(entity);

    await expect(repo.update(entity2)).rejects.toThrow(
      new NotFoundError(entity2.entity_id, StubEntity),
    );
  });
});
