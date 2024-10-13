import { v4 as uuidv4, validate } from 'uuid';
import ValueObject from './value-object';

export class Uuid extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id ?? this.generate();

    this.validate();
  }

  generate() {
    return uuidv4();
  }

  private validate() {
    const isValid = validate(this.id);

    if (!isValid) {
      throw new InvalidUuidError();
    }
  }

  toString() {
    return this.id;
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || 'Id must be a valid uuid.');
    this.name = 'InvalidUuidError';
  }
}
