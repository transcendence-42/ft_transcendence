
import {Channel} from './channel.entity'
import {User} from './user.entity'


export class UserOnChannel {
  channel?: Channel ;
channelId: number ;
user?: User ;
userId: number ;
isTmpMuted: boolean ;
isTmpBanned: boolean ;
}
