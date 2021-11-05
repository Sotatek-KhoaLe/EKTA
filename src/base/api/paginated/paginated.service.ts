import { SelectQueryBuilder } from 'typeorm';
import { Pagination, IPaginationOptions, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { PaginationTypeEnum } from 'nestjs-typeorm-paginate/dist/interfaces';
// import { ApiProperty } from '@nestjs/swagger';
export * from 'nestjs-typeorm-paginate';

import { config } from '@/config';
import { PaginationDto } from './paginated.dto';

export class PaginatedMeta implements IPaginationMeta {
  [s: string]: any;
  // @ApiProperty()
  totalPages: number;
  // @ApiProperty()
  currentPage: number;

  // @ApiProperty()
  totalItems: number;
  // @ApiProperty()
  itemCount: number;
  // @ApiProperty()
  itemsPerPage: number;

  constructor(meta: IPaginationMeta) {
    Object.assign(this, meta);
  }
}

export class PaginatedResult<TData> {
  // @ApiProperty()
  meta: PaginatedMeta;

  // @ApiProperty()
  data: TData[];

  constructor(data: TData[], meta: IPaginationMeta) {
    this.data = data;
    this.meta = new PaginatedMeta(meta);
  }
}

export type ListOrPageResult<TData> = PaginatedResult<TData> | TData[];

export async function paginateTransformer<TEntity>(
  method: { <TEntity>(queryBuilder: SelectQueryBuilder<TEntity>, options: IPaginationOptions) },
  queryBuilder: SelectQueryBuilder<TEntity>,
  options: PaginationDto,
): Promise<PaginatedResult<TEntity>> {
  const _options: IPaginationOptions = {
    page: parseInt(options.page + '') || 1,
    limit: parseInt(options.limit + '') || config.LIST_LIMIT,
    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
  };
  const pagination: Pagination<TEntity> = await method(queryBuilder, _options);
  return new PaginatedResult<TEntity>(pagination.items, pagination.meta);
}
