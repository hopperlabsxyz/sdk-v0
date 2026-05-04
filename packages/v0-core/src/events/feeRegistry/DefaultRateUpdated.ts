import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IDefaultRateUpdated extends ILog {
  oldRate: BigIntish;
  newRate: BigIntish;
}

/**
 * Emitted by `FeeRegistry.updateDefaultRate(rate)`. The event signature widens
 * the rate to `uint256` even though storage is `uint16` — values remain capped
 * by `MAX_PROTOCOL_RATE` (BPS).
 */
export class DefaultRateUpdated extends Log {
  public readonly name: 'DefaultRateUpdated' = 'DefaultRateUpdated';
  public readonly oldRate: bigint;
  public readonly newRate: bigint;

  constructor({
    oldRate,
    newRate,
    ...args
  }: IDefaultRateUpdated) {
    super(args);
    this.oldRate = BigInt(oldRate);
    this.newRate = BigInt(newRate);
  }
}
