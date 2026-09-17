import { expect, test } from "vitest";
import { createClient, custom, numberToHex } from "viem";
import { fetchTotalAssetsTimestamps } from "../src/fetch";

// No fork: the forked test vaults hold 0 in both fields, which hides a swap.
test("reads the expiration from the low half of the slot and the lifespan from the high half", async () => {
  const expiration = 33325437023n;
  const lifespan = 31536000000n;
  const slot = numberToHex((lifespan << 128n) | expiration, { size: 32 });
  const client = createClient({
    transport: custom({ request: async () => slot }),
  });

  const value = await fetchTotalAssetsTimestamps(
    { address: "0x936facdf10c8c36294e7b9d28345255539d81bc7" },
    client
  );

  expect(value).toStrictEqual({
    totalAssetsExpiration: expiration,
    totalAssetsLifespan: lifespan,
  });
});
