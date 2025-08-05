import { type Address, type Client } from "viem";
import { EncodingUtils, OptinProxy } from "@lagoon-protocol/v0-core";
import { extractAddress, extractSlot, getStorageSlot } from "../utils";
import { getCode, getStorageAt } from "viem/actions";
import { StorageFetchError } from "../errors";
import type { GetStorageAtParameters, GetCodeParameters, FetchParameters } from "../types";

export async function fetchOptinProxy(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<OptinProxy> {
  const [
    implementation,
    bytecode
  ] = await Promise.all([
    fetchImplementation({ address }, client, parameters),
    getCode(client, { address, ...parameters })
  ]);
  if (!bytecode) throw new StorageFetchError(address)
  return new OptinProxy({
    address,
    implementation,
    admin: extractAddress(extractSlot(bytecode, 114)),
    logicRegistry: extractAddress(extractSlot(bytecode, 56)),
  });
}

/**
 * Gets implemnetation address from contract storage
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with implementation address
 */
export async function fetchImplementation(
  { address }: { address: Address },
  client: Client,
  parameters: GetStorageAtParameters = {}
): Promise<Address> {
  const { slot = getStorageSlot(EncodingUtils.EIP1967_PROXY_IMPLEMENTATION_SLOT, 0), ...restParams } = parameters
  const data = await getStorageAt(client, { slot, address, ...restParams })
  if (!data) throw new StorageFetchError(slot)
  return extractAddress(data)
}


/**
 * Gets admin address from contract bytecode
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with admin address
 */
export async function fetchAdmin(
  { address }: { address: Address },
  client: Client,
  parameters: GetCodeParameters = {}
): Promise<Address> {
  const bytecode = await getCode(client, { address, ...parameters })
  if (!bytecode) throw new StorageFetchError(address)
  return extractAddress(extractSlot(bytecode, 114))
}

/**
 * Gets logic registry address from contract bytecode
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with logic registry address
 */
export async function fetchLogicRegistry(
  { address }: { address: Address },
  client: Client,
  parameters: GetCodeParameters = {}
): Promise<Address> {
  const bytecode = await getCode(client, { address, ...parameters })
  if (!bytecode) throw new StorageFetchError(address)
  return extractAddress(extractSlot(bytecode, 56))
}
