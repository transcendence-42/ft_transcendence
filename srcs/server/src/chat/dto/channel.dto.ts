import { IsArray, IsString } from 'class-validator';

export class ChannelDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  password?: string;

  @IsArray()
  @IsString({ each: true })
  usersIdList: string[];
}
