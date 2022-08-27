import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  offset: number;
}
