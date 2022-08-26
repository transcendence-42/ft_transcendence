
import {Credentials} from './credentials.entity'
import {Stats} from './stats.entity'
import {Rank} from './rank.entity'
import {Channel} from './channel.entity'
import {UserOnChannel} from './userOnChannel.entity'
import {Friendship} from './friendship.entity'
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
hasActivated2fa: boolean ;
credentials?: Credentials  | null;
stats?: Stats  | null;
rankingHistory?: Rank[] ;
ownedChannels?: Channel[] ;
channels?: UserOnChannel[] ;
friendshipRequested?: Friendship[] ;
friendshipAddressed?: Friendship[] ;
matches?: PlayerOnMatch[] ;
achievements?: UserAchievement[] ;
}
