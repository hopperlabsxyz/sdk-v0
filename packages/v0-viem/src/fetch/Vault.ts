import { decodeFunctionResult, encodeFunctionData, type Address, type Client } from "viem";
import { code, abi } from "../queries/GetVault"
import { call } from "viem/actions";
import type { FetchParameters } from "../types";

export async function fetchVault(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
) {

  const res = await call(client, {
    ...parameters,
    to: address,
    data: encodeFunctionData({ abi, functionName: 'query' }),
    stateOverride: [{
      address,
      code
    }]
  })

  if (res.data) {
    return decodeFunctionResult({
      abi,
      functionName: 'query',
      data: res.data, // raw hex data returned from the call
    });
  }
}
