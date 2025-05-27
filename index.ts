import { Vault } from "@hopperlabsxyz/v0-core";
import { fetchVault } from "@hopperlabsxyz/v0-viem";
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const vault = await fetchVault('0x7895a046b26cc07272b022a0c9bafc046e6f6396', client)
console.log(vault);

