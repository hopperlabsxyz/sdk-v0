import { fetchVault } from "@hopperlabsxyz/v0-viem";
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const vault = await fetchVault('0x07ed467acd4ffd13023046968b0859781cb90d9b', client)
console.log(vault);
