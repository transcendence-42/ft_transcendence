import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  password?: string;
}
