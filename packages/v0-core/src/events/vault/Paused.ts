import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IPaused extends ILog {
  account: Address;
}

export class Paused extends Log {
  public readonly name: 'Paused' = 'Paused';
  public readonly account: Address;

  constructor({
    account,
    ...args
  }: IPaused) {
    super(args);
    this.account = account;
  }
}
