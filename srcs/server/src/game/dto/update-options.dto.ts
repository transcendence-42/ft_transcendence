import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOptionsDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsBoolean()
  readonly effects?: boolean;
}
