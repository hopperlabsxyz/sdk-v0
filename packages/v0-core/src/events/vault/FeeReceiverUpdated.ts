import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IFeeReceiverUpdated extends ILog {
  oldReceiver: Address;
  newReceiver: Address;
}

export class FeeReceiverUpdated extends Log {
  public readonly name: 'FeeReceiverUpdated' = 'FeeReceiverUpdated';
  public readonly oldReceiver: Address;
  public readonly newReceiver: Address;

  constructor({
    oldReceiver,
    newReceiver,
    ...args
  }: IFeeReceiverUpdated) {
    super(args);
    this.oldReceiver = oldReceiver;
    this.newReceiver = newReceiver;
  }
}
