import type { Address } from "../types";

interface IUser {
  address: Address;
  vault: Address;
  hasDepositRequestOnboarded: boolean;
  hasRedeemRequestOnboarded: boolean;
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

  constructor({
    address,
    vault,
    hasDepositRequestOnboarded,
    hasRedeemRequestOnboarded
  }: IUser) {
    this.address = address;
    this.vault = vault;
    this.hasDepositRequestOnboarded = hasDepositRequestOnboarded;
    this.hasRedeemRequestOnboarded = hasRedeemRequestOnboarded;
  }
}
