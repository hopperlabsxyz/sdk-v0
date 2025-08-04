import type { BigIntish } from "../types";

export interface IDelayProxyAdmin {
  implementationUpdateTime: BigIntish;
  newImplementation: BigIntish;
  delayUpdateTime: BigIntish;
  newDelay: BigIntish;
  delay: BigIntish;
}

/**
 * DelayProxyAdmin - A TypeScript representation of the DelayProxyAdmin smart contract
 * 
 * This class represents a proxy admin contract that enforces time delays before upgrades
 * can be executed. It provides a timelock mechanism for both implementation upgrades
 * and delay period changes.
 */
export class DelayProxyAdmin implements IDelayProxyAdmin {
  /** 
   * The maximum delay before which the implementation and the delay can be upgraded
   */
  public readonly MAX_DELAY: bigint = 2592000n;

  /** 
   * The minimum delay before which the implementation and the delay can be upgraded
   */
  public readonly MIN_DELAY: bigint = 86400n;

  /**
   * The timestamp at which upgradeAndCall is callable
   */
  public readonly implementationUpdateTime: bigint;

  /**
   * The new implementation address that will be enforced after upgradeAndCall
   */
  public readonly newImplementation: bigint;

  /**
   * The timestamp at which updateDelay is callable
   */
  public readonly delayUpdateTime: bigint;

  /**
   * The new delay period that will be enforced after updateDelay
   */
  public readonly newDelay: bigint;

  /**
   * The time to wait before upgradeAndCall and updateDelay can be called
   * to enforce implementation and newDelay respectively
   */
  public readonly delay: bigint;

  constructor({
    implementationUpdateTime,
    newImplementation,
    delayUpdateTime,
    newDelay,
    delay,
  }: IDelayProxyAdmin) {
    this.implementationUpdateTime = BigInt(implementationUpdateTime);
    this.newImplementation = BigInt(newImplementation);
    this.delayUpdateTime = BigInt(delayUpdateTime);
    this.newDelay = BigInt(newDelay);
    this.delay = BigInt(delay);
  }
}
