# @lagoon-protocol/v0-computation

Computation package that defines some Lagoon related computations utilities:

## How to install

```bash
npm install @lagoon-protocol/v0-computation
```

```bash
bun install @lagoon-protocol/v0-computation
```

## How to use

```typescript
import { simulate } from "@lagoon-protocol/v0-computation";

const simulationResult = await simulate(vault, {
  totalAssetsForSimulation: 1000000000000000000n,
  assetsInSafe: 0n,
  pendingSiloBalances: {
    assets: 0n,
    shares: 0n,
  },
  pendingSettlement: {
    assets: 0n,
    shares: 0n,
  },
  settleDeposit: false,
  inception: undefined,
  thirtyDay: undefined,
});
```

## Local development:

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run test
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Disclaimer ⚠️

This SDK is provided on a best-effort basis by the Lagoon team to facilitate integration with Lagoon Vaults. While we strive to ensure the accuracy, reliability, and security of this software, it is provided “as is” without any guarantees or warranties of any kind, express or implied.

Lagoon and its contributors accept no responsibility or liability for any loss, damage, or other consequences resulting from the use, misuse, or inability to use this SDK. It is the responsibility of the integrator to perform appropriate testing, due diligence, and security assessments before deploying or relying on this software in production environments.

By using this SDK, you acknowledge and agree to assume all associated risks.
