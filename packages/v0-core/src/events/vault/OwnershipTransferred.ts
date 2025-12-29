import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IOwnershipTransferred extends ILog {
  previousOwner: Address;
  newOwner: Address;
}

export class OwnershipTransferred extends Log {
  public readonly name: 'OwnershipTransferred' = 'OwnershipTransferred';
  public readonly previousOwner: Address;
  public readonly newOwner: Address;

  constructor({
    previousOwner,
    newOwner,
    ...args
  }: IOwnershipTransferred) {
    super(args);
    this.previousOwner = previousOwner;
    this.newOwner = newOwner;
  }
}
