import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ISafeUpdated extends ILog {
  oldSafe: Address;
  newSafe: Address;
}

export class SafeUpdated extends Log {
  public readonly name: 'SafeUpdated' = 'SafeUpdated';
  public readonly oldSafe: Address;
  public readonly newSafe: Address;

  constructor({
    oldSafe,
    newSafe,
    ...args
  }: ISafeUpdated) {
    super(args);
    this.oldSafe = oldSafe;
    this.newSafe = newSafe;
  }
}
