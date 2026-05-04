import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IProtocolFeeReceiverUpdated extends ILog {
  oldReceiver: Address;
  newReceiver: Address;
}

/**
 * Emitted by `FeeRegistry.updateProtocolFeeReceiver(_protocolFeeReceiver)`
 * (declared in `protocol-v2/FeeRegistry.sol`) when the protocol-wide fee
 * receiver is rotated.
 */
export class ProtocolFeeReceiverUpdated extends Log {
  public readonly name: 'ProtocolFeeReceiverUpdated' = 'ProtocolFeeReceiverUpdated';
  public readonly oldReceiver: Address;
  public readonly newReceiver: Address;

  constructor({
    oldReceiver,
    newReceiver,
    ...args
  }: IProtocolFeeReceiverUpdated) {
    super(args);
    this.oldReceiver = oldReceiver;
    this.newReceiver = newReceiver;
  }
}
