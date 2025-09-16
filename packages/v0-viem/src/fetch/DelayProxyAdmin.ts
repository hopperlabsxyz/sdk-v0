import { getBlock, readContract } from "viem/actions";
import { parseAbi, type Address, type Client } from "viem";
import type { FetchParameters } from "../types";
import { DelayProxyAdmin, MathLib } from "@lagoon-protocol/v0-core";
import { fetchOwner } from "./Ownable";

const delayProxyAdminAbi = parseAbi([
  "function implementationUpdateTime() view returns (uint256)",
  "function newImplementation() view returns (address)",
  "function delayUpdateTime() view returns (uint256)",
  "function newDelay() view returns (uint256)",
  "function delay() view returns (uint256)",
]);

/**
 * Gets DelayProxyAdmin data including all timing and implementation information
 *
 * @param address - DelayProxyAdmin contract address
 * @param client - Viem client
 * @param parameters - Optional fetch parameters (block number, etc.)
 *
 * @returns Promise with DelayProxyAdmin object containing all properties
 *
 * @example
 * const delayProxyAdmin = await fetchDelayProxyAdmin('0x123...', client);
 */
export async function fetchDelayProxyAdmin(
  address: Address,
  client: Client,
  parameters: FetchParameters = {}
): Promise<DelayProxyAdmin> {
  const [
    owner,
    implementationUpdateTime,
    newImplementation,
    delayUpdateTime,
    newDelay,
    delay,
  ] = await Promise.all([
    fetchOwner({ address }, client, parameters),
    fetchImplementationUpdateTime({ address }, client, parameters),
    fetchNewImplementation({ address }, client, parameters),
    fetchDelayUpdateTime({ address }, client, parameters),
    fetchNewDelay({ address }, client, parameters),
    fetchDelay({ address }, client, parameters),
  ]);

  return new DelayProxyAdmin({
    address,
    owner,
    implementationUpdateTime,
    newImplementation,
    delayUpdateTime,
    newDelay,
    delay,
  });
}

/**
 * Gets the timestamp at which upgradeAndCall is callable
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with implementation update time as bigint
 */
export async function fetchImplementationUpdateTime(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return await readContract(client, {
    ...parameters,
    address,
    abi: delayProxyAdminAbi,
    functionName: "implementationUpdateTime",
  });
}

/**
 * Gets the new implementation address that will be enforced after upgradeAndCall
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with new implementation address as bigint (address converted to bigint)
 */
export async function fetchNewImplementation(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<Address> {
  const implementation = await readContract(client, {
    ...parameters,
    address,
    abi: delayProxyAdminAbi,
    functionName: "newImplementation",
  });
  return implementation;
}

/**
 * Gets the timestamp at which updateDelay is callable
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with delay update time as bigint
 */
export async function fetchDelayUpdateTime(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return await readContract(client, {
    ...parameters,
    address,
    abi: delayProxyAdminAbi,
    functionName: "delayUpdateTime",
  });
}

/**
 * Gets the new delay period that will be enforced after updateDelay
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with new delay as bigint
 */
export async function fetchNewDelay(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return await readContract(client, {
    ...parameters,
    address,
    abi: delayProxyAdminAbi,
    functionName: "newDelay",
  });
}

/**
 * Gets the current delay period
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with current delay as bigint
 */
export async function fetchDelay(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  return await readContract(client, {
    ...parameters,
    address,
    abi: delayProxyAdminAbi,
    functionName: "delay",
  });
}

/**
 * Checks if an implementation upgrade can be executed (delay period has passed)
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with boolean indicating if upgrade is ready
 */
export async function fetchCanUpgrade(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<boolean> {
  const [implementationUpdateTime, block] = await Promise.all([
    fetchImplementationUpdateTime({ address }, client, parameters),
    getBlock(client, parameters),
  ]);
  return (
    implementationUpdateTime !== MathLib.MAX_UINT_256 &&
    block.timestamp >= implementationUpdateTime
  );
}

/**
 * Checks if a delay update can be executed (delay period has passed)
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with boolean indicating if delay update is ready
 */
export async function fetchCanUpdateDelay(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<boolean> {
  const [delayUpdateTime, block] = await Promise.all([
    fetchDelayUpdateTime({ address }, client, parameters),
    getBlock(client, parameters),
  ]);
  return (
    delayUpdateTime !== MathLib.MAX_UINT_256 &&
    block.timestamp >= delayUpdateTime
  );
}

/**
 * Gets the time remaining before an implementation upgrade can be executed
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with time remaining in seconds as bigint (-1 if no upgrade scheduled)
 */
export async function fetchTimeUntilUpgrade(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  const [implementationUpdateTime, block] = await Promise.all([
    fetchImplementationUpdateTime({ address }, client, parameters),
    getBlock(client, parameters),
  ]);
  if (implementationUpdateTime === MathLib.MAX_UINT_256) return -1n;
  return MathLib.zeroFloorSub(implementationUpdateTime, block.timestamp);
}

/**
 * Gets the time remaining before a delay update can be executed
 * @param address - Contract address
 * @param client - Viem client
 * @param parameters - Fetch parameters
 * @returns Promise with time remaining in seconds as bigint (-1 if no delay update scheduled)
 */
export async function fetchTimeUntilDelayUpdate(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<bigint> {
  const [delayUpdateTime, block] = await Promise.all([
    fetchDelayUpdateTime({ address }, client, parameters),
    getBlock(client, parameters),
  ]);
  if (delayUpdateTime === MathLib.MAX_UINT_256) return -1n;
  return MathLib.zeroFloorSub(delayUpdateTime, block.timestamp);
}
