import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly profilePicture?: string;

  @IsNumber()
  @IsOptional()
  readonly currentStatus?: number;

  @IsNumber()
  @IsOptional()
  readonly currentLadder?: number;
}
