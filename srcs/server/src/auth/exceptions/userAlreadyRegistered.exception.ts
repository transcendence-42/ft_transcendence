import { InternalAuthException } from './internalAuth.exception';

export class userAlreadyRegisteredException extends InternalAuthException {
  constructor(message?: string) {
    super(message);
  }
}
