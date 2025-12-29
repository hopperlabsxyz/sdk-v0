import type { BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface ITotalAssetsLifespanUpdated extends ILog {
  oldLifespan: BigIntish;
  newLifespan: BigIntish;
}

export class TotalAssetsLifespanUpdated extends Log {
  public readonly name: 'TotalAssetsLifespanUpdated' = 'TotalAssetsLifespanUpdated';
  public readonly oldLifespan: bigint;
  public readonly newLifespan: bigint;

  constructor({
    oldLifespan,
    newLifespan,
    ...args
  }: ITotalAssetsLifespanUpdated) {
    super(args);
    this.oldLifespan = BigInt(oldLifespan);
    this.newLifespan = BigInt(newLifespan);
  }
}
