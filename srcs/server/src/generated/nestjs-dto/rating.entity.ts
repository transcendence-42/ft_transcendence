
import {User} from './user.entity'


export class Rating {
  id: number ;
date: Date ;
rating: number ;
user?: User ;
userId: number ;
}
