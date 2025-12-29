import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface ITransfer extends ILog {
  from: Address;
  to: Address;
  value: BigIntish;
}

export class Transfer extends Log {
  public readonly name: 'Transfer' = 'Transfer';
  public readonly from: Address;
  public readonly to: Address;
  public readonly value: bigint;

  constructor({
    from,
    to,
    value,
    ...args
  }: ITransfer) {
    super(args);
    this.from = from;
    this.to = to;
    this.value = BigInt(value);
  }
}
