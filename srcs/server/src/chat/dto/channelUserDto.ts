import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
