import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ISafeLocked extends ILog {
  safe: Address;
}

export class SafeLocked extends Log {
  public readonly name: 'SafeLocked' = 'SafeLocked';
  public readonly safe: Address;

  constructor({
    safe,
    ...args
  }: ISafeLocked) {
    super(args);
    this.safe = safe;
  }
}
