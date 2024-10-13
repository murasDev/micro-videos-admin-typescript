import { Notification } from './validators/notification';
import ValueObject from './value-objects/value-object';

export abstract class Entity {
  abstract get entity_id(): ValueObject;

  notification: Notification = new Notification();
  abstract toJSON(): any;
}
