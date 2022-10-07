
import {UserRole} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateUserOnChannelDto {
  @ApiProperty({ enum: UserRole})
role?: UserRole;
}
