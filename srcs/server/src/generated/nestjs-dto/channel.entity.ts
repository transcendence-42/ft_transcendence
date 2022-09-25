
import {ChannelType} from '@prisma/client'
import {User} from './user.entity'
import {UserOnChannel} from './userOnChannel.entity'


export class Channel {
  id: number ;
name: string ;
type: ChannelType ;
password: string  | null;
owner?: User ;
ownerId: number ;
users?: UserOnChannel[] ;
}
