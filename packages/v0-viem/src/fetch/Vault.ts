import { Vault, Version } from "@hopperlabsxyz/v0-core";
import { decodeFunctionResult, encodeFunctionData, parseAbi, type Address, type Client } from "viem";
import { code, abi } from "../queries/GetVault"
import { call, readContract } from "viem/actions";
import type { FetchParameters } from "../types";
import type { BigIntish } from "v0-core/dist/types";



export interface IToken {
  address: Address;
  name?: string;
  symbol?: string;
  decimals?: BigIntish;
  price?: BigIntish;
}

export interface Rates {
  managementRate: number;
  performanceRate: number;
}

export enum State {
  Open,
  Closing,
  Closed
}

export interface IVault extends IToken {
  asset: Address;
  underlyingDecimals: number;
  owner: Address;
  pendingOwner: Address;
  whitelistManager: Address;
  feeReceiver: Address;
  safe: Address;
  feeRegistry: Address;
  valuationManager: Address;
  newRatesTimestamp: bigint;
  lastFeeTime: bigint;
  highWaterMark: bigint;
  cooldown: bigint;
  rates: Rates
  oldRates: Rates;
  totalAssets: bigint;
  newTotalAssets: bigint;
  depositEpochId: number;
  depositSettleId: number;
  lastDepositEpochIdSettled: number;
  redeemEpochId: number;
  redeemSettleId: number;
  lastRedeemEpochIdSettled: number;
  pendingSilo: Address;
  wrappedNativeToken: Address;
  decimals: number;
  decimalsOffset: number;
  totalAssetsExpiration: bigint;
  totalAssetsLifespan: bigint;
  state: State,
  isWhitelistActivated: boolean,
  version: Version
}

export async function fetchVault(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
) {
  const [res, version] = await Promise.all([
    call(client, {
      ...parameters,
      to: address,
      data: encodeFunctionData({ abi, functionName: 'query' }),
      stateOverride: [{
        address,
        code
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
      version: version as Version,
      ...decodeFunctionResult({
        abi,
        functionName: 'query',
        data: res.data, // raw hex data returned from the call
      })
    });
  }
}
