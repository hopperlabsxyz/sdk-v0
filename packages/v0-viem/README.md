# @hopperlabsxyz/v0-viem

Viem based extension of `@hopperlabsxyz/v0-core`, inspired by [@morpho-org/blue-sdk-viem](https://github.com/morpho-org/sdks/tree/main/packages/blue-sdk-viem) architecture:

## How to install

```bash
npm install @hopperlabsxyz/v0-viem
```

```bash
bun install @hopperlabsxyz/v0-viem
```

## How to use

```typescript
import { Vault } from "@hopperlabsxyz/v0-viem/augment/Vault";

const vault = await Vault.fetch(
  "0x7895A046b26CC07272B022a0C9BAFC046E6F6396",
  client // viem client.
);

vault.name // e.g. "Noon tacUSN"
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
