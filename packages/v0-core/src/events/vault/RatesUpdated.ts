import type { Rates } from "../../vault";
import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IRatesUpdated extends ILog {
  oldRates: Rates;
  newRate: Rates;
  timestamp: BigIntish;
}

export class RatesUpdated extends Log {
  public readonly name: 'RatesUpdated' = 'RatesUpdated';
  public readonly oldRates: Rates;
  public readonly newRate: Rates;
  public readonly timestamp: bigint;

  constructor({
    oldRates,
    newRate,
    timestamp,
    ...args
  }: IRatesUpdated) {
    super(args);
    this.oldRates = oldRates;
    this.newRate = newRate;
    this.timestamp = BigInt(timestamp);
  }
}
