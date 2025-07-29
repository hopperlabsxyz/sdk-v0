import { Vault, SettleData, tryCatch, VaultUtils } from "@lagoon-protocol/v0-core";
import { decodeFunctionResult, encodeFunctionData, hexToBigInt, hexToBool, hexToNumber, pad, parseAbi, type Address, type Client, } from "viem";
import { GetVault, GetSettleData } from "../queries"
import { call, readContract, getStorageAt } from "viem/actions";
import type { FetchParameters, GetStorageAtParameters } from "../types";
import type { BigIntish } from "v0-core/dist/types/types";
import { fetchBalanceOf } from "./Token";
import { StorageFetchError } from "../errors";
import { getMappingSlot, getStorageSlot } from "../utils";

/**
 * Gets vault data including metadata and configuration
 * 
 * @param address - Vault contract address
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.)
 * 
 * @returns Promise with Vault object containing all vault properties
 * 
 * @example
 * const vault = await fetchVault('0x123...', client);
 */
export async function fetchVault(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<Vault> {
  const [res, version] = await Promise.all([
    call(client, {
      ...parameters,
      to: address,
      data: encodeFunctionData({
        abi: GetVault.abi,
        functionName: 'query'
      }),
      stateOverride: [{
        address,
        code: GetVault.code
      }]
    }),
    (async () => {
      try {
        return await readContract(client, {
          ...parameters,
          address,
          abi: parseAbi(["function version() returns(string)"]),
          functionName: "version"
        });
      } catch {
        return "v0.2.0"; // we assume there isn't more v0.1.0 in the nature
      }
    })()])

  if (!res.data) throw new Error("fetch: vault data is undefined"); // TODO: appropriate error type
  return new Vault({
    address,
    version,
    ...decodeFunctionResult({
      abi: GetVault.abi,
      functionName: 'query',
      data: res.data, // raw hex data returned from the call
    })
  });
}

/**
 * Gets settle data for a specific settlement id
 * 
 * @param vault - Object containing vault address
 * @param settleId - Settlement id to query
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidate to bypass cache
 * 
 * @returns Promise with SettleData object
 * 
 * @example
 * const settleData = await fetchSettleData({ address: '0x123...' }, 42, client, { blocknumber: 1 });
 */
export async function fetchSettleData(
  { address }: {
    address: Address
  },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
): Promise<SettleData> {
  if (parameters.revalidate === false) {
    const { data: settleData } = await tryCatch((async () => SettleData.get(settleId))())
    if (settleData) return settleData
  }
  delete parameters.revalidate;

  const res = await call(client, {
    ...parameters,
    to: address,
    data: encodeFunctionData({
      abi: GetSettleData.abi,
      functionName: 'query',
      args: [settleId]
    }),
    stateOverride: [{
      address,
      code: GetSettleData.code
    }]
  })
  if (!res.data) throw new Error("fetchSettleData: settleData is undefined"); // TODO: appropriate error type
  return new SettleData({
    settleId: settleId,
    ...decodeFunctionResult({
      abi: GetSettleData.abi,
      functionName: 'query',
      data: res.data, // raw hex data returned from the call
    })
  });
}

/**
 * Gets pending asset amounts to be deposited for a specific settlement
 * 
 * @param vault - Vault object with address, pendingSilo, and asset
 * @param settleId - Settlement id to query
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidate to bypass cache
 * 
 * @returns Promise with pending asset balance
 * 
 * @example
 * const pendingAssets = await fetchPendingAssets(vault, 42, client, { blocknumber: 1 });
 */
export async function fetchPendingAssets(
  { address, pendingSilo, asset }: {
    address: Address,
    pendingSilo: Address,
    asset: Address
  },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [settleData, pendingSiloAssets] = await Promise.all([
    fetchSettleData({ address }, settleId, client, parameters),
    fetchBalanceOf({ address: asset }, pendingSilo, client, parameters)
  ])
  if (settleData.pendingAssets === 0n) return pendingSiloAssets;
  return settleData.pendingAssets;

}

/**
 * Gets pending share amounts to be redeemed for a specific settlement
 * 
 * @param vault - Vault object with address and pendingSilo
 * @param settleId - Settlement id to query
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidate to bypass cache
 * 
 * @returns Promise with pending share balance
 * 
 * @example
 * const pendingShares = await fetchPendingShares(vault, 42, client, { blocknumber: 1 });
 */
export async function fetchPendingShares(
  { address, pendingSilo }: {
    address: Address,
    pendingSilo: Address
  },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [settleData, pendingSiloShares] = await Promise.all([
    fetchSettleData({ address }, settleId, client, parameters),
    fetchBalanceOf({ address }, pendingSilo, client, parameters),
  ])
  if (settleData.pendingShares === 0n) return pendingSiloShares;
  return settleData.pendingShares;
}

/**
 * Gets both pending assets to be deposited and shares to be redeemed for deposit and redeem settlements
 * 
 * @param vault - Vault object with settlement ids and addresses
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidate to bypass cache
 * 
 * @returns Promise with {pendingAssets, pendingShares}
 * 
 * @example
 * const {pendingAssets, pendingShares} = await fetchPendings(vault, client, { blocknumber: 1 });
 */
export async function fetchPendings(
  { depositSettleId, redeemSettleId, ...vault }: {
    address: Address,
    pendingSilo: Address,
    asset: Address,
    depositSettleId: number,
    redeemSettleId: number
  },
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [pendingAssets, pendingShares] = await Promise.all([
    fetchPendingAssets(vault, depositSettleId, client, parameters),
    fetchPendingShares(vault, redeemSettleId, client, parameters),
  ])
  return { pendingAssets, pendingShares }
}



/**
 * Gets assets to unwind along with pending balances and safe asset balance
 * 
 * @param vault - Vault object with safe, address, pendingSilo, asset, and other vault properties
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidate to bypass cache
 * 
 * @returns Promise with {assetsToUnwind, pendingAssets, pendingShares, safeAssetBalance}
 * 
 * @example
 * const {
 *     assetsToUnwind,
 *     pendingAssets, 
 *     pendingShares, 
 *     safeAssetBalance
 *  } = await fetchAssetsToUnwind({ ...vault, totalAssets: 42n }, client, { blocknumber: 1 });
 */
export async function fetchAssetsToUnwind(
  { safe, ...vault }: {
    address: Address,
    pendingSilo: Address,
    asset: Address,
    safe: Address,
    totalAssets: BigIntish,
    totalSupply: BigIntish,
    decimalsOffset: BigIntish,
    depositSettleId: number,
    redeemSettleId: number
  },
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [{ pendingAssets, pendingShares }, safeAssetBalance] = await Promise.all([
    fetchPendings(vault, client, parameters),
    fetchBalanceOf({ address: vault.asset }, safe, client, parameters)
  ])
  const assetsToUnwind = VaultUtils.calculateAssetsToUnwind(pendingShares, pendingAssets, safeAssetBalance, vault)
  return {
    assetsToUnwind,
    pendingAssets,
    pendingShares,
    safeAssetBalance,
  }
}

/**
 * Gets pending silo balances for shares and assets
 * 
 * @param vault - Vault object with pendingSilo, address, and asset
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.)
 * 
 * @returns Promise with {shares, assets} balances
 * 
 * @example
 * const {shares, assets} = await fetchPendingSiloBalances(vault, client, { blocknumber: 1 });
 */
export async function fetchPendingSiloBalances(
  { address, pendingSilo, asset }: {
    address: Address,
    asset: Address,
    pendingSilo: Address,
  },
  client: Client,
  parameters: FetchParameters
) {
  const [shares, assets] = await Promise.all([
    fetchBalanceOf({ address }, pendingSilo, client, parameters),
    fetchBalanceOf({ address: asset }, pendingSilo, client, parameters)
  ])
  return { shares, assets }
}

/**
 * Gets total assets from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with total assets as bigint
 */
export async function fetchTotalAssets(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 0), ...params }: GetStorageAtParameters
): Promise<bigint> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return hexToBigInt(data)
}


/**
 * Gets new total assets from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with new total assets as bigint
 */
export async function fetchNewTotalAssets(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 1), ...params }: GetStorageAtParameters
): Promise<bigint> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return hexToBigInt(data)
}

/**
 * Gets epoch and settlement id from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with epoch and settlement id object
 */
export async function fetchEpochAndSettleIds(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 2), ...params }: GetStorageAtParameters
): Promise<{
  depositEpochId: number
  depositSettleId: number
  lastDepositEpochIdSettled: number
  redeemEpochId: number
  redeemSettleId: number
  lastRedeemEpochIdSettled: number
}> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  const value = hexToBigInt(data)
  const depositEpochId = Number(value & 0xFFFFFFFFFFn)
  const depositSettleId = Number((value >> 40n) & 0xFFFFFFFFFFn)
  const lastDepositEpochIdSettled = Number((value >> 80n) & 0xFFFFFFFFFFn)
  const redeemEpochId = Number((value >> 120n) & 0xFFFFFFFFFFn)
  const redeemSettleId = Number((value >> 160n) & 0xFFFFFFFFFFn)
  const lastRedeemEpochIdSettled = Number((value >> 200n) & 0xFFFFFFFFFFn)
  return { depositEpochId, depositSettleId, lastDepositEpochIdSettled, redeemEpochId, redeemSettleId, lastRedeemEpochIdSettled }
}

/**
 * Gets last deposit request ID for a user
 * @param userAddress - User's address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with last deposit request id
 */
export async function fetchLastDepositRequestId(
  userAddress: Address,
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 5), ...params }: GetStorageAtParameters
): Promise<number> {
  const lastDepositRequestIdSlot = getMappingSlot(slot, pad(userAddress))
  const data = await getStorageAt(client, { slot: lastDepositRequestIdSlot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return hexToNumber(data)
}


/**
 * Gets last redeem request ID for a user
 * @param userAddress - User's address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with last redeem request id
 */
export async function fetchLastRedeemRequestId(
  userAddress: Address,
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 6), ...params }: GetStorageAtParameters
): Promise<number> {
  const lastRedeemRequestIdSlot = getMappingSlot(slot, pad(userAddress))
  const data = await getStorageAt(client, { slot: lastRedeemRequestIdSlot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return hexToNumber(data)
}

/**
 * Checks if an address is an operator for a controller
 * @param controller - Controller address
 * @param operator - Operator address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with operator status as boolean
 */
export async function fetchIsOperator(
  controller: Address,
  operator: Address,
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 7), ...params }: GetStorageAtParameters
): Promise<boolean> {
  if (operator === controller) return true;
  const controllerSlot = getMappingSlot(slot, pad(controller))
  const operatorSlot = getMappingSlot(controllerSlot, pad(operator))
  const data = await getStorageAt(client, { slot: operatorSlot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return hexToBool(data)
}


/**
 * Gets pending silo address from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with pending silo address
 */
export async function fetchPendingSilo(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 8), ...params }: GetStorageAtParameters
): Promise<Address> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return `0x${data.slice(-40)}`
}

/**
 * Gets wrapped native token address from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with wrapped native token address
 */
export async function fetchWrappedNativeToken(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 9), ...params }: GetStorageAtParameters
): Promise<Address> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  return `0x${data.slice(-40)}`
}


/**
 * Gets decimals and decimals offset from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with { decimals, decimalsOffset }
 */
export async function fetchDecimalsData(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 9), ...params }: GetStorageAtParameters
): Promise<{ decimals: number; decimalsOffset: number }> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  const value = hexToBigInt(data)
  const decimals = Number((value >> 160n) & 0xffn)
  const decimalsOffset = Number((value >> 0x21n) & 0xffn)
  return { decimals, decimalsOffset }
}


/**
 * Gets total assets timestamps from contract storage
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with { totalAssetsExpiration, totalAssetsLifespan }
 */
export async function fetchTotalAssetsTimestamps(
  client: Client,
  { slot = getStorageSlot(VaultUtils.ERC7540_STORAGE_LOCATION, 10), ...params }: GetStorageAtParameters
): Promise<{
  totalAssetsExpiration: bigint
  totalAssetsLifespan: bigint
}> {
  const data = await getStorageAt(client, { slot, ...params })
  if (!data) throw new StorageFetchError(slot)
  const value = hexToBigInt(data)
  const totalAssetsLifespan = value & ((1n << 128n) - 1n)
  const totalAssetsExpiration = (value >> 128n) & ((1n << 128n) - 1n)
  return { totalAssetsExpiration, totalAssetsLifespan }
}
