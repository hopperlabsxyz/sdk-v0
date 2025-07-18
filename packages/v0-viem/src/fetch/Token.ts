import { erc20Abi, type Address, type Client } from "viem";
import { readContract } from "viem/actions";
import type { FetchParameters } from "../types";

export async function fetchBalanceOf(
  { address }: { address: Address },
  account: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return readContract(client, {
    ...parameters,
    address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account]
  })
}
