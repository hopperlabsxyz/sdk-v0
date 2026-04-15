import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IHaircutTaken extends ILog {
  owner: Address;
  shares: BigIntish;
  rate: number;
}

export class HaircutTaken extends Log {
  public readonly name: 'HaircutTaken' = 'HaircutTaken';
  public readonly owner: Address;
  public readonly shares: bigint;
  public readonly rate: number;

  constructor({
    owner,
    shares,
    rate,
    ...args
  }: IHaircutTaken) {
    super(args);
    this.owner = owner;
    this.shares = BigInt(shares);
    this.rate = rate;
  }
}
