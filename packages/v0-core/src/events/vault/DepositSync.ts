import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IDepositSync extends ILog {
  sender: Address;
  owner: Address;
  assets: BigIntish;
  shares: BigIntish;
}

export class DepositSync extends Log {
  public readonly name: 'DepositSync' = 'DepositSync';
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
  }: IDepositSync) {
    super(args);
    this.sender = sender;
    this.owner = owner;
    this.assets = BigInt(assets);
    this.shares = BigInt(shares);
  }
}
