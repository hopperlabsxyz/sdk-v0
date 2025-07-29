
export class StorageFetchError extends Error {
  constructor(slot: string, message?: string) {
    super(message || `Failed to fetch storage data at slot ${slot}`)
    this.name = 'StorageFetchError'
  }
}
