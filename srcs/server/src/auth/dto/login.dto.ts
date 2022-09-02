import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LocalLoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // No need to allow users to submit passwords that do not match our policy
  @Length(12, 36, {
    message: 'password should be between 12 and 36 characters in length',
  })
  password: string;
}
