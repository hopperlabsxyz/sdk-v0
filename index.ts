import { addresses, ChainId } from "@hopperlabsxyz/v0-core";
import { Vault } from "@hopperlabsxyz/v0-viem";
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// @dev
// Some example code to demonstrate the usage of Vault methods

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});


const mainnetBeaconFactory = addresses[ChainId.EthMainnet].beaconProxyFactory

async function fetchVault() {
  return await Vault.fetch('0x07ed467acd4ffd13023046968b0859781cb90d9b', client);
}

const vault = await fetchVault() as Vault;
console.log(vault)

const a1 = Vault.initializeEncoded(vault)
console.log(a1)

const a2 = vault.initializeEncoded();
console.log(a2)

const b1 = Vault.siloConstructorEncoded(vault);
console.log(b1)

const b2 = vault.siloConstructorEncoded();
console.log(b2)

const c1 = Vault.beaconProxyConstructorEncoded(vault, mainnetBeaconFactory);
console.log(c1)

const c2 = vault.beaconProxyConstructorEncoded(mainnetBeaconFactory);
console.log(c2)
