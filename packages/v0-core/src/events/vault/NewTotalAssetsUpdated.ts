import type { BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface INewTotalAssetsUpdated extends ILog {
  totalAssets: BigIntish;
}

export class NewTotalAssetsUpdated extends Log {
  public readonly name: 'NewTotalAssetsUpdated' = 'NewTotalAssetsUpdated';
  public readonly totalAssets: bigint;

  constructor({
    totalAssets,
    ...args
  }: INewTotalAssetsUpdated) {
    super(args);
    this.totalAssets = BigInt(totalAssets);
  }
}
