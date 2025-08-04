import type { Address, Client } from "viem"
import type { FetchParameters } from "../types"
import { readContract } from "viem/actions"

/**
 * Gets admin address from contract by calling the public owner function
 * @param address - Contract address
 * @param client - Viem client
 * @param params - Call parameters (block number, etc.)
 * @returns Promise with owner address
 */
export async function fetchOwner(
  { address }: { address: Address },
  client: Client,
  parameters: FetchParameters = {}
): Promise<Address> {
  return readContract(client, {
    address,
    abi: [
      {
        name: 'owner',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'address', name: '' }]
      }
    ],
    functionName: 'owner',
    ...parameters
  })
}

