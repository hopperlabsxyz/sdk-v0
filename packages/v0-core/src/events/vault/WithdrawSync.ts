import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IWithdrawSync extends ILog {
  sender: Address;
  receiver: Address;
  owner: Address;
  assets: BigIntish;
  shares: BigIntish;
}

export class WithdrawSync extends Log {
  public readonly name: 'WithdrawSync' = 'WithdrawSync';
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
  }: IWithdrawSync) {
    super(args);
    this.sender = sender;
    this.receiver = receiver;
    this.owner = owner;
    this.assets = BigInt(assets);
    this.shares = BigInt(shares);
  }
}
