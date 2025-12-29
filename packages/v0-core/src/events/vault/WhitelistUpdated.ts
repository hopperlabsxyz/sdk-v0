import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IWhitelistUpdated extends ILog {
  account: Address;
  authorized: boolean;
}

export class WhitelistUpdated extends Log {
  public readonly name: 'WhitelistUpdated' = 'WhitelistUpdated';
  public readonly account: Address;
  public readonly authorized: boolean;

  constructor({
    account,
    authorized,
    ...args
  }: IWhitelistUpdated) {
    super(args);
    this.account = account;
    this.authorized = authorized;
  }
}
