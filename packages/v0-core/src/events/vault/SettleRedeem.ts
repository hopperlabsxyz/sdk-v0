import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface ISettleRedeem extends ILog {
  epochId: number;
  settleId: number;
  totalAssets: BigIntish;
  totalSupply: BigIntish;
  assetsWithdrawed: BigIntish;
  sharesBurned: BigIntish;
}

export class SettleRedeem extends Log {
  public readonly name: 'SettleRedeem' = 'SettleRedeem';
  public readonly epochId: number;
  public readonly settleId: number;
  public readonly totalAssets: bigint;
  public readonly totalSupply: bigint;
  public readonly assetsWithdrawed: bigint;
  public readonly sharesBurned: bigint;

  constructor({
    epochId,
    settleId,
    totalAssets,
    totalSupply,
    assetsWithdrawed,
    sharesBurned,
    ...args
  }: ISettleRedeem) {
    super(args);
    this.epochId = epochId;
    this.settleId = settleId;
    this.totalAssets = BigInt(totalAssets);
    this.totalSupply = BigInt(totalSupply);
    this.assetsWithdrawed = BigInt(assetsWithdrawed);
    this.sharesBurned = BigInt(sharesBurned);
  }
}
