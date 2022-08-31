
import {User} from './user.entity'


export class Credentials {
  id: number ;
email: string ;
username: string ;
password: string  | null;
user?: User ;
userId: number ;
twoFactorActivated: boolean ;
twoFactorSecret: string  | null;
}
