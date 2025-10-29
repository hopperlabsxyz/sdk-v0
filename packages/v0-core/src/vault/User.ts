import type { Address } from "../types";

interface IUser {
  address: Address;
  vault: Address;
  hasDepositRequestOnboarded: boolean;
  hasRedeemRequestOnboarded: boolean;
  lastDepositRequestId: number;
  lastRedeemRequestId: number;

  pendingDepositRequest: bigint;
  pendingDepositRequestInShares: bigint;
  maxMint: bigint;
  maxDeposit: bigint;
    
  balance: bigint;
  balanceInAssets: bigint;

  pendingRedeemRequest: bigint;
  pendingRedeemRequestInAssets: bigint;
  maxWithdraw: bigint;
  maxRedeem: bigint;
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
   * The maximum amount of shares the user can claim from his deposit request
   */
  public maxMint: bigint;

  /**
   * The maximum amount of shares the user can finalize the deposit request for
   */
  public maxDeposit: bigint;

  /**
   * The maximum amount of assets the user can claim from his redeem request
   */
  public maxWithdraw: bigint;

  /**
   * The maximum amount of shares the user can finalize his redeem request for
   */
  public maxRedeem: bigint;

  /**
   * The last deposit request ID
   */
  public lastDepositRequestId: number;

  /**
   * The last redeem request ID
  **/
  public lastRedeemRequestId: number;
  
  /**
   * The user's balance of shares
   */
  public balance: bigint;

  /**
   * The user's balance converted into assets at current valuation
   */
  public balanceInAssets: bigint;

  /**
   * The user's position in assets. It takes into account 
   * user's balance
   * pending and claimable deposit requests.
   * pending and claimable redeem requests. 
   */ 
  public positionInShares: bigint;

  /**
   * The user's position in assets. It takes into account 
   * user's balance
   * pending and claimable deposit requests.
   * pending and claimable redeem requests. 
   */ 
  public positionInAssets: bigint;

  /**
   * The user's pending deposit request expressed in assets
   */
  public pendingDepositRequest: bigint;

  /**
   * The user's pending deposit request in shares, converted at current valuation
   */
  public pendingDepositRequestInShares: bigint;


  /**
   * The user's pending redeem request, expressed in shares.
   */
  public pendingRedeemRequest: bigint;

  /**
   * The user's pending redeem request in assets, converted at current valuation
   */
  public pendingRedeemRequestInAssets: bigint;

  constructor({
    address,
    vault,
    hasDepositRequestOnboarded,
    hasRedeemRequestOnboarded,
    lastDepositRequestId,
    lastRedeemRequestId,
    pendingDepositRequest,
    pendingDepositRequestInShares,
    maxMint,
    maxDeposit,
    balance,
    balanceInAssets,
    pendingRedeemRequest,
    pendingRedeemRequestInAssets,
    maxWithdraw,
    maxRedeem,
  }: IUser) {
    this.address = address;
    this.vault = vault;
    this.hasDepositRequestOnboarded = hasDepositRequestOnboarded;
    this.hasRedeemRequestOnboarded = hasRedeemRequestOnboarded;
    this.lastDepositRequestId = lastDepositRequestId;
    this.lastRedeemRequestId = lastRedeemRequestId;
 
    this.pendingDepositRequest = pendingDepositRequest;
    this.pendingDepositRequestInShares = pendingDepositRequestInShares;
    this.maxMint = maxMint;
    this.maxDeposit = maxDeposit;
    
    this.balance = balance;
    this.balanceInAssets = balanceInAssets;

    this.pendingRedeemRequestInAssets = pendingRedeemRequestInAssets;
    this.pendingRedeemRequest = pendingDepositRequest
    this.maxWithdraw = maxWithdraw;
    this.maxRedeem = maxRedeem;
    
    this.positionInShares = pendingDepositRequestInShares + maxMint + balance + pendingRedeemRequest + maxRedeem;
    this.positionInAssets = pendingDepositRequest + maxDeposit + balanceInAssets + pendingRedeemRequestInAssets + maxWithdraw;
  }
}
