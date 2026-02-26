import type { FeeType } from "../../vault";
import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IFeeTaken extends ILog {
  feeType: FeeType;
  shares: BigIntish;
  rate: number;
  contextId: number;
  managerShares: BigIntish;
  protocolShares: BigIntish;
}

export class FeeTaken extends Log {
  public readonly name: 'FeeTaken' = 'FeeTaken';
  public readonly feeType: FeeType;
  public readonly shares: bigint;
  public readonly rate: number;
  public readonly contextId: number;
  public readonly managerShares: bigint;
  public readonly protocolShares: bigint;

  constructor({
    feeType,
    shares,
    rate,
    contextId,
    managerShares,
    protocolShares,
    ...args
  }: IFeeTaken) {
    super(args);
    this.feeType = feeType;
    this.shares = BigInt(shares);
    this.rate = rate;
    this.contextId = contextId;
    this.managerShares = BigInt(managerShares);
    this.protocolShares = BigInt(protocolShares);
  }
}
