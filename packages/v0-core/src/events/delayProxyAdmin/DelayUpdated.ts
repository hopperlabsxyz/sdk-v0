import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IDelayUpdated extends ILog {
  newDelay: BigIntish;
  oldDelay: BigIntish;
}

/**
 * Emitted by `DelayProxyAdmin.updateDelay()` when a previously-scheduled
 * delay change is applied. After this fires, the admin's `delay()` view
 * returns `newDelay` and the pending fields (`newDelay()`, `delayUpdateTime()`)
 * are zeroed.
 */
export class DelayUpdated extends Log {
  public readonly name: 'DelayUpdated' = 'DelayUpdated';
  public readonly newDelay: bigint;
  public readonly oldDelay: bigint;

  constructor({
    newDelay,
    oldDelay,
    ...args
  }: IDelayUpdated) {
    super(args);
    this.newDelay = BigInt(newDelay);
    this.oldDelay = BigInt(oldDelay);
  }
}
