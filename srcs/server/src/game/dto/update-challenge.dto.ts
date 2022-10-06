import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateChallengeDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNumber()
  readonly status?: number;
}
