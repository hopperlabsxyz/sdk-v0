import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface ITotalAssetsUpdated extends ILog {
  totalAssets: BigIntish;
  totalSupply?: BigIntish | null;
}

export class TotalAssetsUpdated extends Log {
  public readonly name: 'TotalAssetsUpdated' = 'TotalAssetsUpdated';
  public readonly totalAssets: bigint;
  public readonly totalSupply: bigint | null;

  constructor({ totalAssets, totalSupply, ...args }: ITotalAssetsUpdated) {
    super(args);
    this.totalAssets = BigInt(totalAssets);
    this.totalSupply = totalSupply ? BigInt(totalSupply) : null;
  }
}
