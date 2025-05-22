import { ChainId, ChainUtils } from '@sdk-v0/core';

const test = ChainUtils.CHAIN_METADATA[1]
const chainId: ChainId = 1 as ChainId;
const test2 = ChainUtils.getExplorerUrl(chainId)
console.log("Hello via Bun!");
console.log(test);
