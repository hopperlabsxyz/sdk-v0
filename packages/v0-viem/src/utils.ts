import { encodePacked, hexToBigInt, keccak256, toHex, type Hex } from "viem"
import { type Uint8, type Uint16, type Uint40, type Uint128 } from "./types"
import { type BigIntish } from "@lagoon-protocol/v0-core";


export function getStorageSlot(baseSlot: Hex, offset: BigIntish): Hex {
  return toHex(hexToBigInt(baseSlot) + BigInt(offset))
}

export function getMappingSlot(baseSlot: Hex, key: Hex): Hex {
  return keccak256(encodePacked(['bytes32', 'bytes32'], [key, baseSlot]))
}

export function extractUint8(value: BigIntish, offset: number): Uint8 {
  return Number((BigInt(value) >> BigInt(offset * 8)) & 0xFFn);
}

export function extractUint16(value: BigIntish, offset: number): Uint16 {
  return Number((BigInt(value) >> BigInt(offset * 16)) & 0xFFFFn);
}

export function extractUint40(value: BigIntish, offset: number): Uint40 {
  return Number((BigInt(value) >> BigInt(offset * 40)) & 0xFFFFFFFFFFn);
}

export function extractUint128(value: BigIntish, offset: number): Uint128 {
  return (BigInt(value) >> BigInt(offset * 128)) & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn;
}
