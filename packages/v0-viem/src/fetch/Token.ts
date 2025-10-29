import { erc20Abi, type Address, type Client } from "viem";
import { readContract } from "viem/actions";
import type { FetchParameters } from "../types";

export async function fetchName(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<string> {
  return readContract(client, {
    ...parameters,
    address,
    abi: erc20Abi,
    functionName: "name",
  })
}

export async function fetchSymbol(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<string> {
  return readContract(client, {
    ...parameters,
    address,
    abi: erc20Abi,
    functionName: "symbol",
  })
}

export async function fetchDecimals(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<number> {
  return readContract(client, {
    ...parameters,
    address,
    abi: erc20Abi,
    functionName: "decimals",
  })
}

export async function fetchTotalSupply(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return readContract(client, {
    ...parameters,
    address,
    abi: erc20Abi,
    functionName: "totalSupply",
  })
}

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
