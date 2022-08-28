import { InternalAuthException } from './internalAuth.exception';

export class ShouldBeLoggedInException extends InternalAuthException {
  constructor(response?: string) {
    super(response);
  }
}
