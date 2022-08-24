
import {User} from './user.entity'


export class UserFriendship {
  requester?: User ;
requesterId: number ;
addressee?: User ;
addresseeId: number ;
date: Date ;
status: number ;
}
