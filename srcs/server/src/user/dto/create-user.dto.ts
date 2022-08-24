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

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'status of the user : 1: online, 0: offline, 2: in game)',
    example: 1,
  })
  readonly currentStatus?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'current position in the ladder',
    example: 17,
  })
  readonly currentLadder?: number;
}
