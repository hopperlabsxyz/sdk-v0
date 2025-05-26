import { decodeFunctionResult, encodeFunctionData, parseAbi, type Address, type Client, type PublicClient } from "viem";
import { code, abi } from "../queries/GetVault"
import { call } from "viem/actions";

export async function fetchVault(
  address: Address,
  client: Client,
) {

  const res = await call(client, {
    to: address,
    data: encodeFunctionData({ abi, functionName: 'query', args: [address] }),
    // data: encodeFunctionData({ abi: viewAbi, functionName: 'pendingSilo' }),
    stateOverride: [{
      address,
      code
    }]
  })
  console.log(res);

  if (res.data) {
    return decodeFunctionResult({
      abi,
      functionName: 'query',
      data: res.data, // raw hex data returned from the call
    });
  }
}
