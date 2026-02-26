import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IMaxCapUpdated extends ILog {
  previousMaxCap: BigIntish;
  maxCap: BigIntish;
}

export class MaxCapUpdated extends Log {
  public readonly name: 'MaxCapUpdated' = 'MaxCapUpdated';
  public readonly previousMaxCap: bigint;
  public readonly maxCap: bigint;

  constructor({
    previousMaxCap,
    maxCap,
    ...args
  }: IMaxCapUpdated) {
    super(args);
    this.previousMaxCap = BigInt(previousMaxCap);
    this.maxCap = BigInt(maxCap);
  }
}
