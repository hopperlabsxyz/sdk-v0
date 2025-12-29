import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IUnpaused extends ILog {
  account: Address;
}

export class Unpaused extends Log {
  public readonly name: 'Unpaused' = 'Unpaused';
  public readonly account: Address;

  constructor({
    account,
    ...args
  }: IUnpaused) {
    super(args);
    this.account = account;
  }
}
