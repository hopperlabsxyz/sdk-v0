import {
  Vault,
  SettleData,
  tryCatch,
  EncodingUtils,
  State,
  type BigIntish,
  VaultUtils,
  Version,
} from "@lagoon-protocol/v0-core";
import {
  decodeFunctionResult,
  encodeFunctionData,
  getAddress,
  hexToBigInt,
  hexToBool,
  hexToNumber,
  maxUint256,
  numberToHex,
  pad,
  parseAbi,
  type Address,
  type Client,
} from "viem";
import { GetVault, GetSettleData } from "../queries";
import { call, readContract, getStorageAt, getBlock } from "viem/actions";
import type { FetchParameters, GetStorageAtParameters } from "../types";
import {
  fetchBalanceOf,
  fetchName,
  fetchSymbol,
  fetchTotalSupply,
} from "./Token";
import { BlockFetchError, StorageFetchError } from "../errors";
import {
  extractUint8,
  extractUint16,
  extractUint40,
  extractUint128,
  getMappingSlot,
  getStorageSlot,
} from "../utils";
import { fetchOwner } from "./Ownable";

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
  {
    const [vaultResponse, versionResponse] = await Promise.all([
      tryCatch(
        (async () =>
          (
            await call(client, {
              ...parameters,
              to: address,
              data: encodeFunctionData({
                abi: GetVault.abi,
                functionName: "query",
              }),
              stateOverride: [
                {
                  address,
                  code: GetVault.code,
                },
              ],
            })
          ).data)()
      ),
      tryCatch(
        readContract(client, {
          ...parameters,
          address,
          abi: parseAbi(["function version() returns(string)"]),
          functionName: "version",
        })
      ),
    ]);
    if (vaultResponse.data) {
      return new Vault({
        address,
        version: versionResponse.data ?? Version.v0_2_0,
        ...decodeFunctionResult({
          abi: GetVault.abi,
          functionName: "query",
          data: vaultResponse.data, // raw hex data returned from the call
        }),
      });
    }
  }
  // Fallback in case the rpc node does not support state overrides
  {
    const [
      name,
      symbol,
      totalSupply,
      asset,
      underlyingDecimals,
      totalAssets,
      newTotalAssets,
      epochAndSettleIds,
      pendingSilo,
      wrappedNativeToken,
      decimalsData,
      totalAssetsTimestamps,
      feeRegistry,
      newRatesTimestamp,
      lastFeeTime,
      highWaterMark,
      cooldown,
      feeRates,
      owner,
      pendingOwner,
      whitelistManager,
      feeReceiver,
      safe,
      valuationManager,
      state,
      isWhitelistActivated,
      versionResponse,
    ] = await Promise.all([
      fetchName({ address }, client, parameters),
      fetchSymbol({ address }, client, parameters),
      fetchTotalSupply({ address }, client, parameters),
      fetchAsset({ address }, client, parameters),
      fetchUnderlyingDecimals({ address }, client, parameters),
      fetchTotalAssets({ address }, client, parameters),
      fetchNewTotalAssets({ address }, client, parameters),
      fetchEpochAndSettleIds({ address }, client, parameters),
      fetchPendingSilo({ address }, client, parameters),
      fetchWrappedNativeToken({ address }, client, parameters),
      fetchDecimalsData({ address }, client, parameters),
      fetchTotalAssetsTimestamps({ address }, client, parameters),
      fetchFeeRegistry({ address }, client, parameters),
      fetchNewRatesTimestamp({ address }, client, parameters),
      fetchLastFeeTime({ address }, client, parameters),
      fetchHighWaterMark({ address }, client, parameters),
      fetchCooldown({ address }, client, parameters),
      fetchFeeRates({ address }, client, parameters),
      fetchOwner({ address }, client, parameters),
      fetchPendingOwner({ address }, client, parameters),
      fetchWhitelistManager({ address }, client, parameters),
      fetchFeeReceiver({ address }, client, parameters),
      fetchSafe({ address }, client, parameters),
      fetchValuationManager({ address }, client, parameters),
      fetchState({ address }, client, parameters),
      fetchIsWhitelistActivated({ address }, client, parameters),
      tryCatch(
        readContract(client, {
          ...parameters,
          address,
          abi: parseAbi(["function version() returns(string)"]),
          functionName: "version",
        })
      ),
    ]);
    return new Vault({
      address,
      name,
      symbol,
      totalSupply,
      asset,
      underlyingDecimals,
      totalAssets,
      newTotalAssets,
      ...epochAndSettleIds,
      pendingSilo,
      wrappedNativeToken,
      ...decimalsData,
      ...totalAssetsTimestamps,
      feeRegistry,
      newRatesTimestamp,
      lastFeeTime,
      highWaterMark,
      cooldown,
      feeRates,
      owner,
      pendingOwner,
      whitelistManager,
      feeReceiver,
      safe,
      valuationManager,
      state,
      isWhitelistActivated,
      version: versionResponse.data ?? Version.v0_2_0,
    });
  }
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
  { address }: { address: Address },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
): Promise<SettleData> {
  if (parameters.revalidate === false) {
    const { data: settleData } = await tryCatch(
      (async () => SettleData.get(settleId))()
    );
    if (settleData) return settleData;
  }
  delete parameters.revalidate;

  {
    const response = await tryCatch(
      (async () =>
        (
          await call(client, {
            ...parameters,
            to: address,
            data: encodeFunctionData({
              abi: GetSettleData.abi,
              functionName: "query",
              args: [settleId],
            }),
            stateOverride: [
              {
                address,
                code: GetSettleData.code,
              },
            ],
          })
        ).data)()
    );
    if (response.data) {
      return new SettleData({
        settleId: settleId,
        ...decodeFunctionResult({
          abi: GetSettleData.abi,
          functionName: "query",
          data: response.data, // raw hex data returned from the call
        }),
      });
    }
  }
  // Fallback in case the rpc node does not support state overrides
  {
    const totalSupplySlot = getMappingSlot(
      getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 4),
      pad(numberToHex(settleId))
    );
    const totalAssetsSlot = getStorageSlot(totalSupplySlot, 1);
    const pendingAssetsSlot = getStorageSlot(totalSupplySlot, 2);
    const pendingSharesSlot = getStorageSlot(totalSupplySlot, 3);
    const [totalSupply, totalAssets, pendingAssets, pendingShares] =
      await Promise.all([
        getStorageAt(client, { slot: totalSupplySlot, address, ...parameters }),
        getStorageAt(client, { slot: totalAssetsSlot, address, ...parameters }),
        getStorageAt(client, {
          slot: pendingAssetsSlot,
          address,
          ...parameters,
        }),
        getStorageAt(client, {
          slot: pendingSharesSlot,
          address,
          ...parameters,
        }),
      ]);
    if (!totalSupply) throw new StorageFetchError(totalSupplySlot);
    if (!totalAssets) throw new StorageFetchError(totalAssetsSlot);
    if (!pendingAssets) throw new StorageFetchError(pendingAssetsSlot);
    if (!pendingShares) throw new StorageFetchError(pendingSharesSlot);
    return new SettleData({
      settleId,
      totalSupply,
      totalAssets,
      pendingAssets,
      pendingShares,
    });
  }
}

/**
 * Gets pending asset amounts to be deposited for a specific settlement. If no valuation
 * has been proposed, we will return the pending silo assets.
 *
 * @param vault - Vault object with address, pendingSilo, and asset
 * @param settleId - Settlement id to query
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidate to bypass cache
 *
 * @returns Promise with pending asset balance
 *
 * @example
 * const pendingAssets = await fetchPendingSettlementAssets(vault, 42, client, { blocknumber: 1 });
 */
export async function fetchPendingSettlementAssets(
  {
    address,
    pendingSilo,
    asset,
  }: {
    address: Address;
    pendingSilo: Address;
    asset: Address;
  },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [settleData, pendingSiloAssets, newTotalAssets] = await Promise.all([
    fetchSettleData({ address }, settleId, client, parameters),
    fetchBalanceOf({ address: asset }, pendingSilo, client, parameters),
    fetchNewTotalAssets({ address }, client, parameters),
  ]);
  if (newTotalAssets === maxUint256) return pendingSiloAssets;
  return settleData.pendingAssets;
}

/**
 * Gets pending share amounts to be redeemed for a specific settlement. If no valuation
 * has been proposed, we will return the pending silo shares.
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
export async function fetchPendingSettlementShares(
  {
    address,
    pendingSilo,
  }: {
    address: Address;
    pendingSilo: Address;
  },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [settleData, pendingSiloShares, newTotalAssets] = await Promise.all([
    fetchSettleData({ address }, settleId, client, parameters),
    fetchBalanceOf({ address }, pendingSilo, client, parameters),
    fetchNewTotalAssets({ address }, client, parameters),
  ]);
  if (newTotalAssets === maxUint256) return pendingSiloShares;
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
export async function fetchPendingSettlement(
  {
    depositSettleId,
    redeemSettleId,
    ...vault
  }: {
    address: Address;
    pendingSilo: Address;
    asset: Address;
    depositSettleId: number;
    redeemSettleId: number;
  },
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [assets, shares] = await Promise.all([
    fetchPendingSettlementAssets(vault, depositSettleId, client, parameters),
    fetchPendingSettlementShares(vault, redeemSettleId, client, parameters),
  ]);
  return { assets, shares };
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
  {
    safe,
    ...vault
  }: {
    address: Address;
    pendingSilo: Address;
    asset: Address;
    safe: Address;
    totalAssets: BigIntish;
    totalSupply: BigIntish;
    decimalsOffset: BigIntish;
    depositSettleId: number;
    redeemSettleId: number;
  },
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [{ assets, shares }, safeAssetBalance] = await Promise.all([
    fetchPendingSettlement(vault, client, parameters),
    fetchBalanceOf({ address: vault.asset }, safe, client, parameters),
  ]);
  const assetsToUnwind = VaultUtils.calculateAssetsToUnwind(
    shares,
    assets,
    safeAssetBalance,
    vault
  );
  return {
    assetsToUnwind,
    pendingSettlement: {
      assets,
      shares,
    },
    safeAssetBalance,
  };
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
  {
    address,
    pendingSilo,
    asset,
  }: {
    address: Address;
    asset: Address;
    pendingSilo: Address;
  },
  client: Client,
  parameters: FetchParameters = {}
) {
  const [shares, assets] = await Promise.all([
    fetchBalanceOf({ address }, pendingSilo, client, parameters),
    fetchBalanceOf({ address: asset }, pendingSilo, client, parameters),
  ]);
  return { shares, assets };
}

/**
 * Gets total assets from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with total assets as bigint
 */
export async function fetchTotalAssets(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<bigint> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBigInt(data);
}

/**
 * Gets new total assets from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with new total assets as bigint
 */
export async function fetchNewTotalAssets(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<bigint> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 1),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBigInt(data);
}

/**
 * Gets epoch and settlement id from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with epoch and settlement id object
 */
export async function fetchEpochAndSettleIds(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<{
  depositEpochId: number;
  depositSettleId: number;
  lastDepositEpochIdSettled: number;
  redeemEpochId: number;
  redeemSettleId: number;
  lastRedeemEpochIdSettled: number;
}> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 2),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  const value = hexToBigInt(data);
  const depositEpochId = extractUint40(value, 0);
  const depositSettleId = extractUint40(value, 1);
  const lastDepositEpochIdSettled = extractUint40(value, 2);
  const redeemEpochId = extractUint40(value, 3);
  const redeemSettleId = extractUint40(value, 4);
  const lastRedeemEpochIdSettled = extractUint40(value, 5);
  return {
    depositEpochId,
    depositSettleId,
    lastDepositEpochIdSettled,
    redeemEpochId,
    redeemSettleId,
    lastRedeemEpochIdSettled,
  };
}

/**
 * Gets last deposit request ID for a user
 * @param address - Contract address
 * @param userAddress - User's address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with last deposit request id
 */
export async function fetchLastDepositRequestId(
  { address }: { address: Address },
  userAddress: Address,
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<number> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 5),
    ...restParams
  } = params;
  const lastDepositRequestIdSlot = getMappingSlot(slot, pad(userAddress));
  const data = await getStorageAt(client, {
    slot: lastDepositRequestIdSlot,
    address,
    ...restParams,
  });
  if (!data) throw new StorageFetchError(slot);
  return hexToNumber(data);
}

/**
 * Gets last redeem request ID for a user
 * @param address - Contract address
 * @param userAddress - User's address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with last redeem request id
 */
export async function fetchLastRedeemRequestId(
  { address }: { address: Address },
  userAddress: Address,
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<number> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 6),
    ...restParams
  } = params;
  const lastRedeemRequestIdSlot = getMappingSlot(slot, pad(userAddress));
  const data = await getStorageAt(client, {
    slot: lastRedeemRequestIdSlot,
    address,
    ...restParams,
  });
  if (!data) throw new StorageFetchError(slot);
  return hexToNumber(data);
}

/**
 * Checks if an address is an operator for a controller
 * @param address - Contract address
 * @param controller - Controller address
 * @param operator - Operator address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with operator status as boolean
 */
export async function fetchIsOperator(
  { address }: { address: Address },
  controller: Address,
  operator: Address,
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<boolean> {
  if (operator === controller) return true;
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 7),
    ...restParams
  } = params;
  const controllerSlot = getMappingSlot(slot, pad(controller));
  const operatorSlot = getMappingSlot(controllerSlot, pad(operator));
  const data = await getStorageAt(client, {
    slot: operatorSlot,
    address,
    ...restParams,
  });
  if (!data) throw new StorageFetchError(slot);
  return hexToBool(data);
}

/**
 * Gets pending silo address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with pending silo address
 */
export async function fetchPendingSilo(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 8),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets wrapped native token address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with wrapped native token address
 */
export async function fetchWrappedNativeToken(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 9),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets decimals and decimals offset from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with { decimals, decimalsOffset }
 */
export async function fetchDecimalsData(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<{ decimals: number; decimalsOffset: number }> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 9),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  const value = hexToBigInt(data);
  const decimals = extractUint8(value, 20);
  const decimalsOffset = extractUint8(value, 21);
  return { decimals, decimalsOffset };
}

/**
 * Gets total assets timestamps from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with { totalAssetsExpiration, totalAssetsLifespan }
 */
export async function fetchTotalAssetsTimestamps(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<{
  totalAssetsExpiration: bigint;
  totalAssetsLifespan: bigint;
}> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC7540_STORAGE_LOCATION, 10),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  const value = hexToBigInt(data);
  const totalAssetsLifespan = extractUint128(value, 0);
  const totalAssetsExpiration = extractUint128(value, 1);
  return { totalAssetsExpiration, totalAssetsLifespan };
}

/**
 * Gets underlying asset address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with asset address
 */
export async function fetchAsset(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC4626_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets underlying decimals from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with underlying decimals number
 */
export async function fetchUnderlyingDecimals(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<number> {
  const {
    slot = getStorageSlot(EncodingUtils.ERC4626_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  const value = hexToBigInt(data);
  return extractUint8(value, 20);
}

/**
 * Gets fee registry address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with fee registry address
 */
export async function fetchFeeRegistry(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets the timestamp at which the new rates will be applied
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with total assets as bigint
 */
export async function fetchNewRatesTimestamp(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<bigint> {
  const {
    slot = getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 1),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBigInt(data);
}

/**
 * Gets the timestamp of the last fee calculation, used to compute management fees
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with last fee time bigint
 */
export async function fetchLastFeeTime(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<bigint> {
  const {
    slot = getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 2),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBigInt(data);
}

/**
 * Gets the highest price per share ever reached, performance fees are taken when the price per share is above this value
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with high-water mark bigint
 */
export async function fetchHighWaterMark(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<bigint> {
  const {
    slot = getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 3),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBigInt(data);
}

/**
 * Gets the time to wait before applying new rates
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with cooldown bigint
 */
export async function fetchCooldown(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<bigint> {
  const {
    slot = getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 4),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBigInt(data);
}

/**
 * Gets the current fee rates
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with { managementRate: number, performanceRate: number }
 */
export async function fetchFeeRates(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<{ managementRate: number; performanceRate: number }> {
  const [newRatesTimestamp, block] = await Promise.all([
    fetchNewRatesTimestamp({ address }, client, params),
    getBlock(client, params),
  ]);
  if (!block) throw new BlockFetchError(params.blockNumber ?? params.blockTag);
  const {
    slot = newRatesTimestamp <= block.timestamp
      ? getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 5) // rates slot
      : getStorageSlot(EncodingUtils.FEE_MANAGER_STORAGE_LOCATION, 6), // old rate slot
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  const value = hexToBigInt(data);
  return {
    managementRate: extractUint16(value, 0),
    performanceRate: extractUint16(value, 1),
  };
}

/**
 * Gets pending admin address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with pending owner address
 */
export async function fetchPendingOwner(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(
      EncodingUtils.OWNABLE_2_STEP_UPGRADEABLE_STORAGE_LOCATION,
      0
    ),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets white-list manager address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with white-list manager address
 */
export async function fetchWhitelistManager(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ROLES_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets fee receiver address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with fee receiver address
 */
export async function fetchFeeReceiver(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ROLES_STORAGE_LOCATION, 1),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets safe address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with safe address
 */
export async function fetchSafe(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ROLES_STORAGE_LOCATION, 2),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * Gets valuation manager address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise with valuation manager address
 */
export async function fetchValuationManager(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<Address> {
  const {
    slot = getStorageSlot(EncodingUtils.ROLES_STORAGE_LOCATION, 4),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return getAddress(`0x${data.slice(-40)}`);
}

/**
 * @param address - Contract address
 * Gets state of the vault (open | closing | closed)
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise State enum
 */
export async function fetchState(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<State> {
  const {
    slot = getStorageSlot(EncodingUtils.VAULT_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToNumber(data);
}

/**
 * Gets wether the whitelist is activated or not from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Storage parameters including slot
 * @returns Promise boolean
 */
export async function fetchIsWhitelistActivated(
  { address }: { address: Address },
  client: Client,
  params: GetStorageAtParameters = {}
): Promise<boolean> {
  const {
    slot = getStorageSlot(EncodingUtils.WHITELISTABLE_STORAGE_LOCATION, 0),
    ...restParams
  } = params;
  const data = await getStorageAt(client, { slot, address, ...restParams });
  if (!data) throw new StorageFetchError(slot);
  return hexToBool(data);
}
