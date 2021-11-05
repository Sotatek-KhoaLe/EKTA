import { BaseEntity as OrmBaseEntity } from 'typeorm';

import { Payload } from '@/base/api/api.schemas';

export interface INotFound<TData> extends Payload<TData> {
  doesThrow?: boolean;
}

export interface IEntityMetaData {
  localName: string;
  errorCodePrefix: string;
}

export class BaseEntity extends OrmBaseEntity {
  constructor(partial: Record<string, any>) {
    super();
    Object.assign(this, partial);
    return this;
  }

  static getMetaData = (): IEntityMetaData => ({
    localName: 'string',
    errorCodePrefix: 'string',
  });
}
