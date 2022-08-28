import * as Session from 'express-session';
import { RequestUser } from '../entities';
export {};
declare global {
  namespace Express {
    export interface Request {
      session: Session;
    }
  }
}
