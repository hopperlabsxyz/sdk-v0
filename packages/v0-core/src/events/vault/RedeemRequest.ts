import type { Address, BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IRedeemRequest extends ILog {
  controller: Address;
  owner: Address;
  requestId: BigIntish;
  sender: Address;
  shares: BigIntish;
}

export class RedeemRequest extends Log {
  public readonly name: 'RedeemRequest' = 'RedeemRequest';
  public readonly controller: Address;
  public readonly owner: Address;
  public readonly requestId: bigint;
  public readonly sender: Address;
  public readonly shares: bigint;

  constructor({
    controller,
    owner,
    requestId,
    sender,
    shares,
    ...args
  }: IRedeemRequest) {
    super(args);
    this.controller = controller;
    this.owner = owner;
    this.requestId = BigInt(requestId);
    this.sender = sender;
    this.shares = BigInt(shares);
  }
}
