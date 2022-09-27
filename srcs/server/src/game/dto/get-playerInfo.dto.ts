import { IsNotEmpty, IsString } from 'class-validator';

export class GetPlayerInfoDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
