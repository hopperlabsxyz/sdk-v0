import type { BlockTag } from "viem"

export class StorageFetchError extends Error {
  constructor(slot: string, message?: string) {
    super(message || `Failed to fetch storage data at slot ${slot}`)
    this.name = 'StorageFetchError'
  }
}

export class BlockFetchError extends Error {
  constructor(blockNumber: bigint | BlockTag | undefined, message?: string) {
    super(message || `Failed to fetch block with number ${blockNumber ?? 'latest'}`)
    this.name = 'StorageFetchError'
  }
}
