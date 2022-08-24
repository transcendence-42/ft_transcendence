import { ReturnTwoHundredException } from './return200.exception';

export class ShouldBeLoggedInException extends ReturnTwoHundredException {
  constructor(response?: string) {
    super(response);
  }
}
