import type { Address, BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface IImplementationUpdateSubmited extends ILog {
  newImplementation: Address;
  implementationUpdateTime: BigIntish;
}

/**
 * Emitted by `DelayProxyAdmin.submitImplementation(newImplementation)` when an
 * upgrade is scheduled. The upgrade becomes executable at
 * `implementationUpdateTime` (a unix timestamp = block.timestamp + delay) via
 * `upgradeAndCall()`. The proxy itself emits the standard ERC-1967 `Upgraded`
 * event when the upgrade actually executes.
 *
 * Note: the contract spells the event `Submited` with a single `t`. The class
 * preserves the on-chain spelling so log parsing matches.
 */
export class ImplementationUpdateSubmited extends Log {
  public readonly name: 'ImplementationUpdateSubmited' = 'ImplementationUpdateSubmited';
  public readonly newImplementation: Address;
  public readonly implementationUpdateTime: bigint;

  constructor({
    newImplementation,
    implementationUpdateTime,
    ...args
  }: IImplementationUpdateSubmited) {
    super(args);
    this.newImplementation = newImplementation;
    this.implementationUpdateTime = BigInt(implementationUpdateTime);
  }
}
