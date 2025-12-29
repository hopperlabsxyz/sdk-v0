import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IDepositRequest extends ILog {
  controller: Address;
  owner: Address;
  requestId: BigIntish;
  sender: Address;
  assets: BigIntish;
}

export class DepositRequest extends Log {
  public readonly name: 'DepositRequest' = 'DepositRequest';
  public readonly controller: Address;
  public readonly owner: Address;
  public readonly requestId: bigint;
  public readonly sender: Address;
  public readonly assets: bigint;

  constructor({
    controller,
    owner,
    requestId,
    sender,
    assets,
    ...args
  }: IDepositRequest) {
    super(args);
    this.controller = controller;
    this.owner = owner;
    this.requestId = BigInt(requestId);
    this.sender = sender;
    this.assets = BigInt(assets);
  }
}
