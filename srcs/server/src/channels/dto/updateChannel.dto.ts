import { ChannelType } from '@prisma/client';
import { UserOnChannel } from 'src/generated/nestjs-dto/userOnChannel.entity';

export class UpdateChannelDto {
  name?: string;
  type?: ChannelType;
  password?: string;
  ownerId?: number;
}
