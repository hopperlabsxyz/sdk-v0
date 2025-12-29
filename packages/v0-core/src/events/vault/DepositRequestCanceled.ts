import type { Address, BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IDepositRequestCanceled extends ILog {
  requestId: BigIntish;
  controller: Address;
}

export class DepositRequestCanceled extends Log {
  public readonly name: 'DepositRequestCanceled' = 'DepositRequestCanceled';
  public readonly requestId: bigint;
  public readonly controller: Address;

  constructor({
    requestId,
    controller,
    ...args
  }: IDepositRequestCanceled) {
    super(args);
    this.requestId = BigInt(requestId);
    this.controller = controller;
  }
}
