import { type Address, User, vaultAbi_v0_5_0 as vaultAbi } from "@lagoon-protocol/v0-core";
import {  type Client } from "viem";
import type { FetchParameters } from "../types";
import { readContract } from "viem/actions";
import { fetchEpochAndSettleIds, fetchLastDepositRequestId, fetchLastRedeemRequestId } from "./Vault";


export async function fetchUser(
  address: Address,
  vault: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<User> {
  const [
    pendingDepositRequest,
    lastDepositRequestId,
    pendingRedeemRequest,
    lastRedeemRequestId,
    {
      depositEpochId,
      redeemEpochId
    },
  ] = await Promise.all([
    fetchPendingDepositRequest({ address },{ vault }, client, parameters),
    fetchLastDepositRequestId({ address: vault }, address, client, parameters),
    fetchPendingRedeemRequest({ address }, { vault } , client, parameters),
    fetchLastRedeemRequestId({ address: vault }, address, client, parameters),
    fetchEpochAndSettleIds({ address: vault }, client, parameters),
  ])
  const hasDepositRequestOnboarded = lastDepositRequestId === depositEpochId ? false : pendingDepositRequest > 0n;
  const hasRedeemRequestOnboarded = lastRedeemRequestId === redeemEpochId ? false : pendingRedeemRequest > 0n;

  const [maxMint, maxWithdraw] = await Promise.all([ fetchMaxMint({ address, lastRequestDepositId: BigInt(lastDepositRequestId) }, vault, client, parameters), fetchMaxWithdraw({ address, lastRequestRedeemId: BigInt(lastRedeemRequestId) }, vault, client, parameters)]);
  return new User({
    address,
    vault,
    hasDepositRequestOnboarded,
    hasRedeemRequestOnboarded,
    maxMint,
    maxWithdraw,
    lastDepositRequestId,
    lastRedeemRequestId,
  })
}

/**
 * Gets pending deposit request amount for a user
 * @param params - Object containing user address and optional request id (default id is 0 meaning the last one)
 * @param vault - Vault contract address
 * @param client - Viem client
 * @param parameters - Additional fetch parameters
 * @returns Promise with pending deposit request amount
 */
export async function fetchPendingDepositRequest(
  { address  }: { address: Address },
  { requestId = 0n, vault }: {  requestId?: bigint, vault: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return readContract(client, {
    ...parameters,
    address: vault,
    abi: vaultAbi,
    functionName: "pendingDepositRequest",
    args: [requestId, address]
  });
}

/**
 * Gets pending redeem request amount for a user
 * @param params - Object containing user address and optional request id (default id is 0 meaning the last one)
 * @param vault - Vault contract address
 * @param client - Viem client
 * @param parameters - Additional fetch parameters
 * @returns Promise with pending redeem request amount
 */
export async function fetchPendingRedeemRequest(
  { address }: { address: Address },
  {requestId = 0n, vault}: {requestId?: bigint, vault: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return readContract(client, {
    ...parameters,
    address: vault,
    abi: vaultAbi,
    functionName: "pendingRedeemRequest",
    args: [requestId, address]
  });
}

export async function fetchMaxMint(
  { address, lastRequestDepositId }: { address: Address, lastRequestDepositId: bigint},
  vault: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  const claimableDepositRequest = await readContract(client, {
    ...parameters,
    address: vault,
    abi: vaultAbi,
    functionName: "claimableDepositRequest",
    args: [0n, address]
  });
  return readContract(client, {
    ...parameters,
    address: vault,
    abi: vaultAbi,
    functionName: "convertToShares",
    args: [lastRequestDepositId, claimableDepositRequest]
  });
}

export async function fetchMaxWithdraw(
  { address, lastRequestRedeemId }: { address: Address, lastRequestRedeemId: bigint },
  vault: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  const claimableRedeemRequest = await readContract(client, {
    ...parameters,
    address: vault,
    abi: vaultAbi,
    functionName: "claimableRedeemRequest",
    args: [0n, address]
  });
  return readContract(client, {
    ...parameters,
    address: vault,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: [lastRequestRedeemId, claimableRedeemRequest]
  });
}