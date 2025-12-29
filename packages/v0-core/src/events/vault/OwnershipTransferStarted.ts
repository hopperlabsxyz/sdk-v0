import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IOwnershipTransferStarted extends ILog {
  previousOwner: Address;
  newOwner: Address;
}

export class OwnershipTransferStarted extends Log {
  public readonly name: 'OwnershipTransferStarted' = 'OwnershipTransferStarted';
  public readonly previousOwner: Address;
  public readonly newOwner: Address;

  constructor({
    previousOwner,
    newOwner,
    ...args
  }: IOwnershipTransferStarted) {
    super(args);
    this.previousOwner = previousOwner;
    this.newOwner = newOwner;
  }
}
