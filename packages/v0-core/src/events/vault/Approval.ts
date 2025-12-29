import type { Address, BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IApproval extends ILog {
  owner: Address;
  spender: Address;
  value: BigIntish;
}

export class Approval extends Log {
  public readonly name: 'Approval' = 'Approval';
  public readonly owner: Address;
  public readonly spender: Address;
  public readonly value: bigint;

  constructor({
    owner,
    spender,
    value,
    ...args
  }: IApproval) {
    super(args);
    this.owner = owner;
    this.spender = spender;
    this.value = BigInt(value);
  }
}
