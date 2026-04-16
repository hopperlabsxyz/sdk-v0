import { test, describe, expect } from "bun:test";
import { User } from "../src/vault/User";

const address = "0x1111111111111111111111111111111111111111";
const vault = "0x2222222222222222222222222222222222222222";

describe("User", () => {
  test("constructor assigns pendingRedeemRequest from the pendingRedeemRequest argument (not pendingDepositRequest)", () => {
    const pendingDepositRequest = 100n;
    const pendingRedeemRequest = 42n;

    const user = new User({
      address,
      vault,
      hasDepositRequestOnboarded: false,
      hasRedeemRequestOnboarded: false,
      lastDepositRequestId: 0,
      lastRedeemRequestId: 0,
      pendingDepositRequest,
      pendingDepositRequestInShares: 0n,
      maxMint: 0n,
      maxDeposit: 0n,
      claimableDepositRequestActualized: 0n,
      balance: 0n,
      balanceInAssets: 0n,
      pendingRedeemRequest,
      pendingRedeemRequestInAssets: 0n,
      maxWithdraw: 0n,
      maxRedeem: 0n,
    });

    expect(user.pendingRedeemRequest).toBe(pendingRedeemRequest);
    expect(user.pendingDepositRequest).toBe(pendingDepositRequest);
  });

  test("positionInShares uses pendingRedeemRequest parameter", () => {
    const user = new User({
      address,
      vault,
      hasDepositRequestOnboarded: false,
      hasRedeemRequestOnboarded: false,
      lastDepositRequestId: 0,
      lastRedeemRequestId: 0,
      pendingDepositRequest: 100n,
      pendingDepositRequestInShares: 10n,
      maxMint: 20n,
      maxDeposit: 0n,
      claimableDepositRequestActualized: 0n,
      balance: 30n,
      balanceInAssets: 0n,
      pendingRedeemRequest: 40n,
      pendingRedeemRequestInAssets: 0n,
      maxWithdraw: 0n,
      maxRedeem: 50n,
    });

    // 10 + 20 + 30 + 40 + 50 = 150
    expect(user.positionInShares).toBe(150n);
  });
});
