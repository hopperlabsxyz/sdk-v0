import type { Address, BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IWithdraw extends ILog {
  sender: Address;
  receiver: Address;
  owner: Address;
  assets: BigIntish;
  shares: BigIntish;
}

export class Withdraw extends Log {
  public readonly name: 'Withdraw' = 'Withdraw';
  public readonly sender: Address;
  public readonly receiver: Address;
  public readonly owner: Address;
  public readonly assets: bigint;
  public readonly shares: bigint;

  constructor({
    sender,
    receiver,
    owner,
    assets,
    shares,
    ...args
  }: IWithdraw) {
    super(args);
    this.sender = sender;
    this.receiver = receiver;
    this.owner = owner;
    this.assets = BigInt(assets);
    this.shares = BigInt(shares);
  }
}
