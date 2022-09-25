
import {ChannelType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateChannelDto {
  name?: string;
@ApiProperty({ enum: ChannelType})
type?: ChannelType;
password?: string;
}
