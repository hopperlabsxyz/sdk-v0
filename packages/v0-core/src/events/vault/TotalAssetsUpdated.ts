import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface ITotalAssetsUpdated extends ILog {
  totalAssets: BigIntish;
}

export class TotalAssetsUpdated extends Log {
  public readonly name: 'TotalAssetsUpdated' = 'TotalAssetsUpdated';
  public readonly totalAssets: bigint;

  constructor({ totalAssets, ...args }: ITotalAssetsUpdated) {
    super(args);
    this.totalAssets = BigInt(totalAssets);
  }
}
