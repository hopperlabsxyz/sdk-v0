import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IPreMint extends ILog {
  sender: Address;
  receiver: Address;
  assets: BigIntish;
  shares: BigIntish;
}

export class PreMint extends Log {
  public readonly name: 'PreMint' = 'PreMint';
  public readonly sender: Address;
  public readonly receiver: Address;
  public readonly assets: bigint;
  public readonly shares: bigint;

  constructor({
    sender,
    receiver,
    assets,
    shares,
    ...args
  }: IPreMint) {
    super(args);
    this.sender = sender;
    this.receiver = receiver;
    this.assets = BigInt(assets);
    this.shares = BigInt(shares);
  }
}
