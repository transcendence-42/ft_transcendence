import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { eChannelUserRole } from '../constants';

export class ChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsEnum(eChannelUserRole)
  role: eChannelUserRole;
}
