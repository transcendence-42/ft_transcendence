import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
