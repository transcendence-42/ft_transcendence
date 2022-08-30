import { InternalAuthException } from './internalAuth.exception';

export class BadCredentialsException extends InternalAuthException {
  constructor(message?: string) {
    super(message);
  }
}
