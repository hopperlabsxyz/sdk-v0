import { createViemTest } from "@morpho-org/test/vitest";
import { mainnet } from "viem/chains";

// Kill process using port 10005
// lsof -ti:10005 | xargs kill -9

export const test = createViemTest(mainnet, {
  forkUrl: process.env.MAINNET_RPC_URL,
  forkBlockNumber: 22_253_107,
});

export const test2 = createViemTest(mainnet, {
  forkUrl: process.env.MAINNET_RPC_URL,
  forkBlockNumber: 22_925_689,
});

export const test3 = createViemTest(mainnet, {
  forkUrl: process.env.MAINNET_RPC_URL,
  forkBlockNumber: 22_868_385,
});

