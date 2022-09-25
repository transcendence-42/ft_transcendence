
import {UserRole} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateUserOnChannelDto {
  @ApiProperty({ enum: UserRole})
role: UserRole;
}
