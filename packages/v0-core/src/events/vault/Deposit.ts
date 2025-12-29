import type { Address, BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IDeposit extends ILog {
  sender: Address;
  owner: Address;
  assets: BigIntish;
  shares: BigIntish;
}

export class Deposit extends Log {
  public readonly name: 'Deposit' = 'Deposit';
  public readonly sender: Address;
  public readonly owner: Address;
  public readonly assets: bigint;
  public readonly shares: bigint;

  constructor({
    sender,
    owner,
    assets,
    shares,
    ...args
  }: IDeposit) {
    super(args);
    this.sender = sender;
    this.owner = owner;
    this.assets = BigInt(assets);
    this.shares = BigInt(shares);
  }
}
