
import {Credentials} from './credentials.entity'
import {Stats} from './stats.entity'
import {Rank} from './rank.entity'
import {Channel} from './channel.entity'
import {UserOnChannel} from './userOnChannel.entity'
import {UserFriendship} from './userFriendship.entity'
import {PlayerOnMatch} from './playerOnMatch.entity'
import {UserAchievement} from './userAchievement.entity'


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
rankingHistory?: Rank[] ;
ownedChannels?: Channel[] ;
channels?: UserOnChannel[] ;
friendshipRequested?: UserFriendship[] ;
friendshipAddressed?: UserFriendship[] ;
matches?: PlayerOnMatch[] ;
achievements?: UserAchievement[] ;
}
