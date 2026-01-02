import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface INewTotalAssetsUpdated extends ILog {
  totalAssets: BigIntish;
  totalSupply?: BigIntish | null;
}

export class NewTotalAssetsUpdated extends Log {
  public readonly name: 'NewTotalAssetsUpdated' = 'NewTotalAssetsUpdated';
  public readonly totalAssets: bigint;
  public readonly totalSupply: bigint | null;

  constructor({
    totalAssets,
    totalSupply,
    ...args
  }: INewTotalAssetsUpdated) {
    super(args);
    this.totalAssets = BigInt(totalAssets);
    this.totalSupply = totalSupply ? BigInt(totalSupply) : null;
  }
}
