import type { BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IInitialized extends ILog {
  version: BigIntish;
}

export class Initialized extends Log {
  public readonly name: 'Initialized' = 'Initialized';
  public readonly version: bigint;

  constructor({
    version,
    ...args
  }: IInitialized) {
    super(args);
    this.version = BigInt(version);
  }
}
