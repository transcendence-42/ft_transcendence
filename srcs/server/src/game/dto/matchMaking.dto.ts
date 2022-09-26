import { IsNotEmpty, IsString } from 'class-validator';

export class MatchMakingDto {
  @IsString()
  @IsNotEmpty()
  readonly value: boolean;
}
