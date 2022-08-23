import { IsNumber, IsString } from 'class-validator';

export class ExceptionsDto {
  @IsNumber()
  readonly statusCode: number;

  @IsString()
  readonly message: string;

  @IsString()
  readonly error: string;
}
