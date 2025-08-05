import type { BlockTag, CallParameters, Hex, UnionPick } from "viem";

export type FetchParameters = UnionPick<
  CallParameters,
  "account" | "blockNumber" | "blockTag" | "stateOverride"
> & {
  chainId?: number;
};

export type GetStorageAtParameters = {
  slot?: Hex
} & (
    | {
      blockNumber?: undefined
      blockTag?: BlockTag | undefined
    }
    | {
      blockNumber?: bigint | undefined
      blockTag?: undefined
    }
  )

export type GetCodeParameters =
  (
    | {
      blockNumber?: undefined
      blockTag?: BlockTag | undefined
    }
    | {
      blockNumber?: bigint | undefined
      blockTag?: undefined
    }
  )

export type Uint8 = number;
export type Uint16 = number;
export type Uint40 = number;
export type Uint128 = bigint;
