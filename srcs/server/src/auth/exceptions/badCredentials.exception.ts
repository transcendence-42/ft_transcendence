import { ReturnTwoHundredException } from './return200.exception';

export class BadCredentialsException extends ReturnTwoHundredException {
  constructor(message?: string) {
    super(message);
  }
}
