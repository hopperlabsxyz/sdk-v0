import { encodePacked, hexToBigInt, keccak256, toHex, type Hex } from "viem"
import { type BigIntish } from "v0-core/dist/types/types";


export function getStorageSlot(baseSlot: Hex, offset: BigIntish): Hex {
  return toHex(hexToBigInt(baseSlot) + BigInt(offset))
}

export function getMappingSlot(baseSlot: Hex, key: Hex): Hex {
  return keccak256(encodePacked(['bytes32', 'bytes32'], [key, baseSlot]))
}
