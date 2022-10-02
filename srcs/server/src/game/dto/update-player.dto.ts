import { IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsString()
  readonly pic?: string;

  @IsString()
  readonly name?: string;
}
