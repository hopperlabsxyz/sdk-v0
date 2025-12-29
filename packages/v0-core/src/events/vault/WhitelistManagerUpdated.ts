import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IWhitelistManagerUpdated extends ILog {
  oldManager: Address;
  newManager: Address;
}

export class WhitelistManagerUpdated extends Log {
  public readonly name: 'WhitelistManagerUpdated' = 'WhitelistManagerUpdated';
  public readonly oldManager: Address;
  public readonly newManager: Address;

  constructor({
    oldManager,
    newManager,
    ...args
  }: IWhitelistManagerUpdated) {
    super(args);
    this.oldManager = oldManager;
    this.newManager = newManager;
  }
}
