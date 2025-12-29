import type { Address, BigIntish, Hash, Hex } from "../types";
import { hexToAddress, hexToHash } from "../utils";

export interface ILog {
  chainId: number;
  blockNumber: BigIntish;
  blockTimestamp?: BigIntish;
  blockHash: Hex;
  transactionHash: Hex;
  transactionIndex: number;
  logIndex: number;
  address: Hex;
}


export abstract class Log {
  public readonly abstract name: string;
  public readonly type: 'log' = 'log';

  public readonly chainId: number;
  public readonly blockNumber: bigint;
  public readonly blockHash: Hash;
  public readonly blockTimestamp: bigint | null;

  public readonly transactionHash: Hash;
  public readonly transactionIndex: number;

  public readonly logIndex: number;
  public readonly address: Address;

  constructor({
    chainId,
    blockNumber,
    blockHash,
    blockTimestamp,
    transactionHash,
    transactionIndex,
    logIndex,
    address,
  }: ILog) {
    this.chainId = chainId;
    this.blockNumber = BigInt(blockNumber);
    this.blockHash = hexToHash(blockHash);
    this.blockTimestamp = blockTimestamp ? BigInt(blockTimestamp) : null;
    this.transactionHash = hexToHash(transactionHash);
    this.transactionIndex = transactionIndex;
    this.logIndex = logIndex;
    this.address = hexToAddress(address);
  }
}
