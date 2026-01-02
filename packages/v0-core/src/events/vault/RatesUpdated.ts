import type { Rates } from "../../vault";
import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IRatesUpdated extends ILog {
  oldRates: Rates;
  newRates: Rates;
  timestamp: BigIntish;
}

export class RatesUpdated extends Log {
  public readonly name: 'RatesUpdated' = 'RatesUpdated';
  public readonly oldRates: Rates;
  public readonly newRates: Rates;
  public readonly timestamp: bigint;

  constructor({
    oldRates,
    newRates,
    timestamp,
    ...args
  }: IRatesUpdated) {
    super(args);
    this.oldRates = oldRates;
    this.newRates = newRates;
    this.timestamp = BigInt(timestamp);
  }
}
