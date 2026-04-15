import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IRedeemRequestCanceled extends ILog {
  requestId: BigIntish;
  controller: Address;
  requestedAmount: BigIntish;
}

export class RedeemRequestCanceled extends Log {
  public readonly name: 'RedeemRequestCanceled' = 'RedeemRequestCanceled';
  public readonly requestId: bigint;
  public readonly controller: Address;
  public readonly requestedAmount: bigint;

  constructor({
    requestId,
    controller,
    requestedAmount,
    ...args
  }: IRedeemRequestCanceled) {
    super(args);
    this.requestId = BigInt(requestId);
    this.controller = controller;
    this.requestedAmount = BigInt(requestedAmount);
  }
}
