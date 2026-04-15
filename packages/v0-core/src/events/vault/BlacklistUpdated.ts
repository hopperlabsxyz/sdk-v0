import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IBlacklistUpdated extends ILog {
  account: Address;
  blacklisted: boolean;
}

export class BlacklistUpdated extends Log {
  public readonly name: 'BlacklistUpdated' = 'BlacklistUpdated';
  public readonly account: Address;
  public readonly blacklisted: boolean;

  constructor({
    account,
    blacklisted,
    ...args
  }: IBlacklistUpdated) {
    super(args);
    this.account = account;
    this.blacklisted = blacklisted;
  }
}
