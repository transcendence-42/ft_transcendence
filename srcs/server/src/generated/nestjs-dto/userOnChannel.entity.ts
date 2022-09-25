
import {UserRole} from '@prisma/client'
import {Channel} from './channel.entity'
import {User} from './user.entity'


export class UserOnChannel {
  channel?: Channel ;
channelId: number ;
user?: User ;
userId: number ;
role: UserRole ;
mutedTill: Date ;
bannedTill: Date ;
}
