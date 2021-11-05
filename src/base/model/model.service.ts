import {
  BaseEntity,
  DeleteResult,
  getConnection,
  InsertResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { EntityId } from 'typeorm/repository/EntityId';
import { Logger } from 'log4js';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { plainToClass } from 'class-transformer';

export class ModelService<T extends BaseEntity, R extends Repository<T>> {
  constructor(
    protected readonly entity, //
    protected readonly repository: R,
    protected readonly logger: Logger,
  ) {}
}
