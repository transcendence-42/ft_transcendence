import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  // to delete
  @IsNumber()
  @ApiProperty({ description: 'id of the user', example: '42' })
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'player name of the user', example: 'homer' })
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'e-mail address',
    example: 'homer@springfield.com',
  })
  readonly email: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: 'url of profile picture',
    example: 'http://site.com/image.png',
  })
  readonly profilePicture?: string;

}
