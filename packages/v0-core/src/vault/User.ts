import type { Address } from "../types";

interface IUser {
  address: Address;
  vault: Address;
  hasPendingDepositRequest: boolean;
  hasPendingRedeemRequest: boolean;
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
  public hasPendingDepositRequest: boolean;

  /**
   * Whether the user has an ongoing redeem request being processed
   */
  public hasPendingRedeemRequest: boolean;

  constructor({
    address,
    vault,
    hasPendingDepositRequest,
    hasPendingRedeemRequest
  }: IUser) {
    this.address = address;
    this.vault = vault;
    this.hasPendingDepositRequest = hasPendingDepositRequest;
    this.hasPendingRedeemRequest = hasPendingRedeemRequest;
  }
}
