import type { BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface ISettleDeposit extends ILog {
  epochId: number;
  settleId: number;
  totalAssets: BigIntish;
  totalSupply: BigIntish;
  assetsDeposited: BigIntish;
  sharesMinted: BigIntish;
}

export class SettleDeposit extends Log {
  public readonly name: 'SettleDeposit' = 'SettleDeposit';
  public readonly epochId: number;
  public readonly settleId: number;
  public readonly totalAssets: bigint;
  public readonly totalSupply: bigint;
  public readonly assetsDeposited: bigint;
  public readonly sharesMinted: bigint;
  constructor({
    epochId,
    settleId,
    totalAssets,
    totalSupply,
    assetsDeposited,
    sharesMinted,
    ...args
  }: ISettleDeposit) {
    super(args);
    this.epochId = epochId;
    this.settleId = settleId;
    this.totalAssets = BigInt(totalAssets);
    this.totalSupply = BigInt(totalSupply);
    this.assetsDeposited = BigInt(assetsDeposited);
    this.sharesMinted = BigInt(sharesMinted);
  }
}
