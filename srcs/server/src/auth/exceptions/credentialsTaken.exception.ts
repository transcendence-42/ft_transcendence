import { InternalAuthException } from './internalAuth.exception';

export class CredentialsTakenException extends InternalAuthException {
  constructor(response?: string) {
    if (response === null)
      response = 'Credentials already taken!'
    super(response);
  }
}
