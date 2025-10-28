import type { Address } from "../types";

interface IUser {
  address: Address;
  vault: Address;
  hasDepositRequestOnboarded: boolean;
  hasRedeemRequestOnboarded: boolean;
  maxMint: bigint;
  maxWithdraw: bigint;
  lastDepositRequestId: number;
  lastRedeemRequestId: number;
}

export class User {
  /**
   * The user's address
   */
  public readonly address: Address;

  /**
   * The vault's address
   */
  public readonly vault: Address;

  /**
   * Whether the user has an ongoing deposit request being processed
   */
  public hasDepositRequestOnboarded: boolean;

  /**
   * Whether the user has an ongoing redeem request being processed
   */
  public hasRedeemRequestOnboarded: boolean;

  /**
   * The maximum amount of shares the user can claim from a deposit request
   */
  public maxMint: bigint;

  /**
   * The maximum amount of assets the user can claim from a redeem request
   */
  public maxWithdraw: bigint;

  /**
   * The last deposit request ID
   */
  public lastDepositRequestId: number;

  /**
   * The last redeem request ID
  **/
  public lastRedeemRequestId: number;

  constructor({
    address,
    vault,
    hasDepositRequestOnboarded,
    hasRedeemRequestOnboarded,
    maxMint,
    maxWithdraw,
    lastDepositRequestId,
    lastRedeemRequestId,
  }: IUser) {
    this.address = address;
    this.vault = vault;
    this.hasDepositRequestOnboarded = hasDepositRequestOnboarded;
    this.hasRedeemRequestOnboarded = hasRedeemRequestOnboarded;
    this.maxMint = maxMint;
    this.maxWithdraw = maxWithdraw;
    this.lastDepositRequestId = lastDepositRequestId;
    this.lastRedeemRequestId = lastRedeemRequestId;
  }
}
