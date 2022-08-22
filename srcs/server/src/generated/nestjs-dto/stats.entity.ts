
import {User} from './user.entity'
import {UserAchievement} from './userAchievement.entity'


export class Stats {
  id: number ;
wins: number ;
losses: number ;
user?: User ;
userId: number ;
achievements?: UserAchievement[] ;
}
