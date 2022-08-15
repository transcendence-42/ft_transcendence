import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // No need to allow users to submit passwords that do not match our policy
  @Matches(
    (/^(?=.{12,36}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\'";.,/#@!%^&*()\][{}])((.)\2?(?!\2))+$/g),
    {
      message:
        'Password must be between 12 and 36 characters long and must contain atleat: one Upper Case' +
        ' letter, one lower case letter, a digit and a special character and must not contain more than 2 consecutive characters.',
    },
  )
  password: string;
}
