import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
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
  readonly profilePicture?: string;

  @IsNumber()
  readonly currentStatus?: number;

  @IsNumber()
  readonly currentLadder?: number;
}
