
import {Credentials} from './credentials.entity'
import {Stats} from './stats.entity'
import {Ladder} from './ladder.entity'
import {Channel} from './channel.entity'
import {UserOnChannel} from './userOnChannel.entity'
import {UserFriendship} from './userFriendship.entity'
import {PlayerOnMatch} from './playerOnMatch.entity'


export class User {
  id: number ;
username: string ;
email: string ;
createdAt: Date ;
profilePicture: string  | null;
currentStatus: number ;
currentLadder: number ;
credentials?: Credentials  | null;
stats?: Stats  | null;
ladderHistory?: Ladder[] ;
ownedChannels?: Channel[] ;
channels?: UserOnChannel[] ;
friendshipRequested?: UserFriendship[] ;
friendshipAccepted?: UserFriendship[] ;
matches?: PlayerOnMatch[] ;
}
