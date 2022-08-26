
import {PlayerOnMatch} from './playerOnMatch.entity'


export class Match {
  id: number ;
date: Date ;
status: number ;
players?: PlayerOnMatch[] ;
}
