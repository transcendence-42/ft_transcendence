import { UserOnChannel } from 'src/generated/nestjs-dto/userOnChannel.entity';

export class UpdateChannelDto {
  name?: string;
  type?: string;
  password?: string;
  ownerId?: number;
}
