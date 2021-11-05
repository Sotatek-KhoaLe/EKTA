import { IsPositive, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { config } from '@/config';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @Max(config.LIST_LIMIT)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  page?: number;
}
