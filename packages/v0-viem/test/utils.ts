import { Address, Client, parseAbi } from "viem";
import {
  fetchTotalAssets,
  fetchNewTotalAssets,
  fetchEpochAndSettleIds,
  fetchPendingSilo,
  fetchWrappedNativeToken,
  fetchDecimalsData,
  fetchTotalAssetsTimestamps,
  fetchAsset,
  fetchUnderlyingDecimals,
  fetchFeeRegistry,
  fetchNewRatesTimestamp,
  fetchLastFeeTime,
  fetchHighWaterMark,
  fetchCooldown,
  fetchFeeRates,
  fetchOwner,
  fetchPendingOwner,
  fetchWhitelistManager,
  fetchFeeReceiver,
  fetchSafe,
  fetchValuationManager,
  fetchState,
  fetchIsWhitelistActivated,
  fetchName,
  fetchSymbol,
  fetchTotalSupply
} from "../src/fetch";
import { FetchParameters } from "../src/types";
import { tryCatch, Vault } from "@lagoon-protocol/v0-core";
import { readContract } from "viem/actions";

export async function testFetchVaultWithStorageFetchers(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
) {
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
    versionResponse
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
        functionName: "version"
      })
    )
  ])
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
    version: versionResponse.data ?? "v0.2.0",
  });

}
