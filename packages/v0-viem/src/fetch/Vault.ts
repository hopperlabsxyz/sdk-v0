import { Vault, type SettleData } from "@lagoon-protocol/v0-core";
import { decodeFunctionResult, encodeFunctionData, parseAbi, type Address, type Client } from "viem";
import { GetVault, GetSettleData } from "../queries"
import { call, readContract } from "viem/actions";
import type { FetchParameters } from "../types";

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
  { address }: { address: Address },
  settleId: number,
  client: Client,
  parameters: FetchParameters = {}
): Promise<SettleData | undefined> {
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
    return {
      ...decodeFunctionResult({
        abi: GetSettleData.abi,
        functionName: 'query',
        data: res.data, // raw hex data returned from the call
      })
    };
  }
}
