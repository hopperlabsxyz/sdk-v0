import { type Address, User } from "@lagoon-protocol/v0-core";
import { parseAbi, type Client } from "viem";
import type { FetchParameters } from "../types";
import { readContract } from "viem/actions";
import { fetchEpochAndSettleIds, fetchLastDepositRequestId, fetchLastRedeemRequestId } from "./Vault";

const vaultAbi = parseAbi([
  'function pendingDepositRequest(uint256,address) public view returns (uint256)',
  'function pendingRedeemRequest(uint256,address) public view returns (uint256)'
])

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
    }
  ] = await Promise.all([
    fetchPendingDepositRequest({ address }, vault, client, parameters),
    fetchLastDepositRequestId({ address: vault }, address, client, parameters),
    fetchPendingRedeemRequest({ address }, vault, client, parameters),
    fetchLastRedeemRequestId({ address: vault }, address, client, parameters),
    fetchEpochAndSettleIds({ address: vault }, client, parameters)
  ])
  const hasPendingDepositRequest = lastDepositRequestId === depositEpochId ? false : pendingDepositRequest > 0n;
  const hasPendingRedeemRequest = lastRedeemRequestId === redeemEpochId ? false : pendingRedeemRequest > 0n;
  return new User({
    address,
    vault,
    hasPendingDepositRequest,
    hasPendingRedeemRequest,
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
  { address, requestId = 0n }: { address: Address; requestId?: bigint },
  vault: Address,
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
  { address, requestId = 0n }: { address: Address; requestId?: bigint },
  vault: Address,
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
