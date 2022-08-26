import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class LocalRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  // @Matches('^(?=.{3,18}$)[a-zA-Z0-0_]*$')
  username: string;

  /* Explanation of the regex pattern
   * The string has to be between 3 and 18 characters
   * it has to be Alphanumeric + '_'
   */

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(
  //   /^(?=.{12,36}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\'";.,/#@!%^&*()\][{}])((.)\2?(?!\2))+$/g,
  //   {
  //     message:
  //       'Password must be between 12 and 36 characters long and must contain atleat: one Upper Case' +
  //       ' letter, one lower case letter, a digit and a special character and must not contain more than 2 consecutive characters.',
  //   },
  // )
  password: string;

  /* Explanation of the regex pattern
   * '^' start of the string
   * '(?=.{12, 30}$)' the string's length must be between 12 and 30 characters
   * '(?=.*[A-Z])' the string must contain atleast one upper case character
   * '(?=.*[a-z])' the string must contain atleast one lower case character
   * '(?=.*[0-9])' the string must contain atleast one digit
   * '(?=.*['";.,/#@!%^&*()][{}]])' the string must contain atleast one of these special character
   * '((.)\2?(?!\2))+' no two consecutive characters
   * '$' end of the string
   */
}

export class FtRegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Matches('^(?=.{3,18}$)[a-zA-Z0-0_]*$')
  username: string;
  /* Explanation of the regex pattern
   * The string has to be between 3 and 18 characters
   * it has to be Alphanumeric + '_'
   */

  @IsUrl()
  @IsOptional()
  profile_image_url: string;
}
