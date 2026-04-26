import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IDelayUpdateSubmited extends ILog {
  currentDelay: BigIntish;
  newDelay: BigIntish;
  delayUpdateTime: BigIntish;
}

/**
 * Emitted by `DelayProxyAdmin.submitDelay(newDelay)` when a delay change is
 * scheduled. The change becomes applicable at `delayUpdateTime` (a unix
 * timestamp = block.timestamp + currentDelay) via `updateDelay()`.
 *
 * Note: the contract spells the event `Submited` with a single `t`. The class
 * preserves the on-chain spelling so log parsing matches.
 */
export class DelayUpdateSubmited extends Log {
  public readonly name: 'DelayUpdateSubmited' = 'DelayUpdateSubmited';
  public readonly currentDelay: bigint;
  public readonly newDelay: bigint;
  public readonly delayUpdateTime: bigint;

  constructor({
    currentDelay,
    newDelay,
    delayUpdateTime,
    ...args
  }: IDelayUpdateSubmited) {
    super(args);
    this.currentDelay = BigInt(currentDelay);
    this.newDelay = BigInt(newDelay);
    this.delayUpdateTime = BigInt(delayUpdateTime);
  }
}
