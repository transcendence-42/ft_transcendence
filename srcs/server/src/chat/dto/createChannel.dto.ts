import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ChannelUserDto } from './channelUserDto';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @ValidateNested({each: true})
  @Type(() => ChannelUserDto)
  usersList: ChannelUserDto[];

  @IsString()
  @IsOptional()
  password?: string;
}
