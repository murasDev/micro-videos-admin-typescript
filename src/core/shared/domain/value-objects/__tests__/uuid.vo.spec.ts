import { InvalidUuidError, Uuid } from '../uuid.vo';

describe('Uuid Unit Tests', () => {
  const idMock = 'f4c7e297-22f0-4701-900a-34841f0df694';

  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  it('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrow(new InvalidUuidError());

    expect(validateSpy).toHaveBeenCalled();
  });

  it('should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid).toBeDefined();
  });

  it('should accept a valid uuid', () => {
    const uuid = new Uuid(idMock);

    expect(uuid.id).toBe(idMock);
  });
});
