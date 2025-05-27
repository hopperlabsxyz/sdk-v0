import { fetchVault } from "@hopperlabsxyz/v0-viem";
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const vault = await fetchVault('0x...', client)
