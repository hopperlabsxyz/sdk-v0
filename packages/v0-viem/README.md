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

## ⚠️ Important Disclaimer

**This software is provided "as is" without any guarantees or warranties of any kind, either express or implied.** The code is offered for ease of use, but users assume all risks and responsibilities when using these SDKs. We make no warranties regarding the accuracy, reliability, or suitability of this software for any particular purpose. **Use at your own risk.**
