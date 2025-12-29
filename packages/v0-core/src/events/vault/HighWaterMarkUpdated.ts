import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IHighWaterMarkUpdated extends ILog {
  oldHighWaterMark: BigIntish;
  newHighWaterMark: BigIntish;
}

export class HighWaterMarkUpdated extends Log {
  public readonly name: 'HighWaterMarkUpdated' = 'HighWaterMarkUpdated';
  public readonly oldHighWaterMark: bigint;
  public readonly newHighWaterMark: bigint;

  constructor({
    oldHighWaterMark,
    newHighWaterMark,
    ...args
  }: IHighWaterMarkUpdated) {
    super(args);
    this.oldHighWaterMark = BigInt(oldHighWaterMark);
    this.newHighWaterMark = BigInt(newHighWaterMark);
  }
}
