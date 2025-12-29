import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IUpgraded extends ILog {
  implementation: Address;
}

export class Upgraded extends Log {
  public readonly name: 'Upgraded' = 'Upgraded';
  public readonly implementation: Address;

  constructor({
    implementation,
    ...args
  }: IUpgraded) {
    super(args);
    this.implementation = implementation;
  }
}
