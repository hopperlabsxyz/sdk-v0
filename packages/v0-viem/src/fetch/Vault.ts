import { Vault, SettleData, tryCatch, VaultUtils } from "@lagoon-protocol/v0-core";
import { decodeFunctionResult, encodeFunctionData, parseAbi, type Address, type Client } from "viem";
import { GetVault, GetSettleData } from "../queries"
import { call, readContract } from "viem/actions";
import type { FetchParameters } from "../types";
import type { BigIntish } from "v0-core/dist/types/types";
import { fetchBalanceOf } from "./Token";

export async function fetchVault(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
) {
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

  if (res.data) {
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
}

export async function fetchSettleData(
  { address }: {
    address: Address
  },
  settleId: number,
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
): Promise<SettleData | undefined> {
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
  if (res.data) {
    return new SettleData({
      settleId: settleId,
      ...decodeFunctionResult({
        abi: GetSettleData.abi,
        functionName: 'query',
        data: res.data, // raw hex data returned from the call
      })
    });
  }
}

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
  if (!settleData) throw new Error("fetchPendingAssets: settleData is undefined"); // TODO: appropriate error type
  if (settleData.pendingAssets === 0n) return pendingSiloAssets;
  return settleData.pendingAssets;

}

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
  if (!settleData) throw new Error("fetchPendingShares: settleData is undefined"); // TODO: appropriate error type
  if (settleData.pendingShares === 0n) return pendingSiloShares;
  return settleData.pendingShares;
}

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

export async function fetchPendingSiloBalances(
  { address, pendingSilo, asset }: {
    address: Address,
    pendingSilo: Address,
    asset: Address,
  },
  client: Client,
  parameters: FetchParameters & { revalidate?: boolean } = { revalidate: false }
) {
  const [shares, assets] = await Promise.all([
    fetchBalanceOf({ address }, pendingSilo, client, parameters),
    fetchBalanceOf({ address: asset }, pendingSilo, client, parameters)
  ])
  return { shares, assets }
}
