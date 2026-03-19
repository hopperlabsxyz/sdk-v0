import { EncodingUtils, Vault } from "@lagoon-protocol/v0-core";

import { fetchBalanceOf, fetchPendingSiloBalances, fetchPendingSettlementAssets, fetchPendingSettlementShares, fetchVault } from "../fetch";
import type { Address, Client } from "viem";
import type { FetchParameters } from "../types";


declare module "@lagoon-protocol/v0-core" {
  namespace Vault {
    let fetch: typeof fetchVault;

    /**
     * Encodes the initialization call for a vault.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    let initializeEncoded: typeof EncodingUtils.initializeEncodedCall;

    /**
     * Encodes the constructor call for a silo.
     *
     * @param vault - The vault object containing the silo constructor parameters.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let siloConstructorEncoded: typeof EncodingUtils.siloConstructorEncodedParams;

    /**
     * Encodes the constructor call for a beacon proxy.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let beaconProxyConstructorEncoded: typeof EncodingUtils.beaconProxyConstructorEncodedParams;

    /**
     * Encodes the constructor params for an OptinProxy.
     *
     * @param params - The OptinProxy constructor parameters.
     * @returns Encoded constructor call data as hex string.
     */
    let optinProxyConstructorEncoded: typeof EncodingUtils.optinProxyConstructorEncodedParams;

    /**
     * Encodes the constructor params for an OptinProxy with vault initialization.
     *
     * @param vault - The vault object with initialization parameters.
     * @param params - The OptinProxy parameters.
     * @returns The encoded constructor call data as hex string.
     */
    let optinProxyWithVaultInitConstructorEncoded: typeof EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams;

    /**
     * Encodes the initialization call for a v0.6.0 vault.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    let initializeEncoded_v0_6_0: typeof EncodingUtils.initializeEncodedCall_v0_6_0;

  }

  /**
   * Vault interface for fetching vault-related data and balances
   */
  interface Vault {
    /**
     * Gets the asset balance in the vault's safe contract
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.)
     * @returns Promise<BigInt> - Safe's asset balance
     */
    getSafeBalance(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchBalanceOf>;

    /**
     * Gets share and asset balances in the vault's pending silo
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidata to bypass cache
     * @returns Promise<{shares: BigInt, assets: BigInt}> - Silo balances
     */
    getSiloBalances(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchPendingSiloBalances>;

    /**
     * Gets the pending assets to be deposited in the next settlement
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters
     * @returns Promise<bigint> - Pending assets amount
     */
    getPendingAssets(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchPendingSettlementAssets>;

    /**
     * Gets the pending shares to be redeemed in the next settlement
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters
     * @returns Promise<bigint> - Pending shares amount
     */
    getPendingShares(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchPendingSettlementShares>;

    /**
     * Computes the assets the curator needs to gather in the safe to honor redemptions
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters
     * @returns Promise with assetsToUnwind, pendingAssets, pendingShares, safeAssetBalance
     */
    getAssetsToUnwind(client: Client, parameters?: FetchParameters): Promise<{
      assetsToUnwind: bigint;
      pendingAssets: bigint;
      pendingShares: bigint;
      safeAssetBalance: bigint;
    }>;

    /**
     * Encodes the initialization call for a vault.
     *
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    initializeEncoded(): ReturnType<typeof EncodingUtils.initializeEncodedCall>;

    /**
     * Encodes the constructor call for a silo.
     *
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    siloConstructorEncoded(): ReturnType<typeof EncodingUtils.siloConstructorEncodedParams>;

    /**
     * Encodes the constructor call for a beacon proxy.
     *
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    beaconProxyConstructorEncoded(beacon: Address): ReturnType<typeof EncodingUtils.beaconProxyConstructorEncodedParams>;

    /**
     * Encodes the constructor params for an OptinProxy with vault initialization.
     *
     * @param params - The OptinProxy parameters.
     * @returns The encoded constructor call data as hex string.
     */
    optinProxyWithVaultInitConstructorEncoded(params: {
      logic: Address;
      logicRegistry: Address;
      initialOwner: Address;
      initialDelay: bigint;
    }): ReturnType<typeof EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams>;
  }
}

// Static method
Vault.fetch = fetchVault;

Vault.initializeEncoded = EncodingUtils.initializeEncodedCall

Vault.siloConstructorEncoded = EncodingUtils.siloConstructorEncodedParams

Vault.beaconProxyConstructorEncoded = EncodingUtils.beaconProxyConstructorEncodedParams

Vault.optinProxyConstructorEncoded = EncodingUtils.optinProxyConstructorEncodedParams

Vault.optinProxyWithVaultInitConstructorEncoded = EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams

Vault.initializeEncoded_v0_6_0 = EncodingUtils.initializeEncodedCall_v0_6_0

// Instance methods
Vault.prototype.getSafeBalance =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchBalanceOf({ address: this.asset }, this.safe, client, parameters)
  };

Vault.prototype.getSiloBalances =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchPendingSiloBalances(this, client, parameters)
  }

Vault.prototype.getPendingAssets =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchPendingSettlementAssets(this, this.depositSettleId, client, parameters)
  }

Vault.prototype.getPendingShares =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchPendingSettlementShares(this, this.redeemSettleId, client, parameters)
  }

Vault.prototype.getAssetsToUnwind =
  async function (client: Client, parameters: FetchParameters = {}) {
    const [pendingAssets, pendingShares, safeAssetBalance] = await Promise.all([
      fetchPendingSettlementAssets(this, this.depositSettleId, client, parameters),
      fetchPendingSettlementShares(this, this.redeemSettleId, client, parameters),
      fetchBalanceOf({ address: this.asset }, this.safe, client, parameters),
    ]);
    const assetsToUnwind = this.calculateAssetsToUnwind(pendingShares, pendingAssets, safeAssetBalance);
    return { assetsToUnwind, pendingAssets, pendingShares, safeAssetBalance };
  }

Vault.prototype.initializeEncoded = function () { return EncodingUtils.initializeEncodedCall(this) }

Vault.prototype.siloConstructorEncoded = function () { return EncodingUtils.siloConstructorEncodedParams(this) }

Vault.prototype.beaconProxyConstructorEncoded = function (beacon: Address) { return EncodingUtils.beaconProxyConstructorEncodedParams(this, beacon) }

Vault.prototype.optinProxyWithVaultInitConstructorEncoded = function (params: {
  logic: Address;
  logicRegistry: Address;
  initialOwner: Address;
  initialDelay: bigint;
}) {
  return EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams(this, params)
}

export { Vault }
