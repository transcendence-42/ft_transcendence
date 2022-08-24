import { ReturnTwoHundredException } from './return200.exception';

export class userAlreadyRegistered extends ReturnTwoHundredException {
  constructor(message?: string) {
    super(message);
  }
}
