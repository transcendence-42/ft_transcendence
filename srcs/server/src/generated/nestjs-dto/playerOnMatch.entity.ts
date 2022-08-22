
import {Match} from './match.entity'
import {User} from './user.entity'


export class PlayerOnMatch {
  match?: Match ;
matchId: number ;
player?: User ;
playerId: number ;
playerNum: number ;
playerScore: number ;
}
