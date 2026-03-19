# CLAUDE.md - Lagoon SDK v0

## Purpose

TypeScript SDK for interacting with Lagoon Protocol vaults (ERC7540 async vaults). Bun monorepo with three packages providing core types, on-chain data fetching, and fee/APR computation.

## Smart Contract Reference

The SDK mirrors the Solidity contracts in `../lagoon-v0/`. When modifying the SDK, consult the contracts as the source of truth:

- **Vault**: `../lagoon-v0/src/v0.6.0/vault/Vault-v0.6.0.sol`
- **Storage layout**: `../lagoon-v0/src/v0.6.0/primitives/VaultStorage.sol`
- **Structs/Enums/Errors/Events**: `../lagoon-v0/src/v0.6.0/primitives/`
- **Libraries**: `../lagoon-v0/src/v0.6.0/libraries/` (ERC7540Lib, FeeLib, RolesLib, VaultLib, AccessableLib)
- **Interfaces**: `../lagoon-v0/src/v0.6.0/interfaces/IERC7540.sol`
- **Protocol**: `../lagoon-v0/src/protocol-v2/` (FeeRegistry, ProtocolRegistry, LogicRegistry)
- **Proxy**: `../lagoon-v0/src/proxy/OptinProxy.sol`, `DelayProxyAdmin.sol`

Storage slot constants in `packages/v0-core/src/vault/EncodingUtils.ts` must match the keccak256-derived locations in Solidity. Cross-reference with `VaultStorage.sol` when adding or modifying storage reads.

## Technology Stack

| Technology | Version |
|------------|---------|
| Bun | 1.2.9+ |
| TypeScript | 5.9+ |
| viem | ^2.0.0 |
| vitest | ^3.2.3 (v0-viem, v0-computation) |
| bun test | (v0-core) |

## Monorepo Structure

```
packages/
├── v0-core/          # Framework-agnostic types, enums, events, ABIs, addresses
│                     # NO runtime dependencies — pure data structures
├── v0-viem/          # On-chain data fetching via viem (storage slot reads, query contracts)
│                     # Depends on: v0-core, viem
└── v0-computation/   # Fee simulation, APR calculation, high water mark
                      # Depends on: v0-core, viem
```

**Dependency rule**: v0-core has zero runtime dependencies. v0-viem and v0-computation depend on v0-core as a peer.

## Key Files

| File | Purpose |
|------|---------|
| `packages/v0-core/src/vault/Vault.ts` | Core Vault class — all vault properties |
| `packages/v0-core/src/vault/EncodingUtils.ts` | Storage slot locations, initialization encoding |
| `packages/v0-core/src/vault/VaultUtils.ts` | Constants (BPS, max rates), share/asset conversions |
| `packages/v0-core/src/constants/abis.ts` | All contract ABIs (large file, ~59KB) |
| `packages/v0-core/src/addresses.ts` | Per-chain deployed contract addresses |
| `packages/v0-core/src/chain.ts` | ChainId enum, chain metadata |
| `packages/v0-core/src/events/vault/` | 45+ event classes extending viem's Log |
| `packages/v0-viem/src/fetch/Vault.ts` | Primary fetchVault() and individual fetch functions |
| `packages/v0-viem/src/queries/` | Bytecode-based stateless query contracts (GetVault, GetSettleData) |
| `packages/v0-viem/src/augment/` | Module augmentation — adds fetch/encoding methods to core classes |
| `packages/v0-computation/src/simulation/` | simulate() — fee preview, price per share, APR |

## Vault Versions

SDK supports v0.1.0 through v0.6.0. Latest is `v0_6_0`. Version-specific logic is gated by the `Version` enum in `Vault.ts`. When adding version-specific features, make new fields optional on `IVault` and provide defaults on the `Vault` class.

## Build & Test

```bash
bun install             # Install dependencies
bun run build           # Build all packages (core → viem → computation)
bun run re              # Clean + rebuild all

# Per-package
cd packages/v0-core && bun test        # Bun test runner
cd packages/v0-viem && bun test        # Vitest
cd packages/v0-computation && bun test # Vitest
```

Each package builds three outputs: `dist/types/`, `dist/cjs/`, `dist/esm/`.

## Conventions

- **Barrel exports**: Every public module must be re-exported from its package's `src/index.ts`.
- **Events**: One file per event in `v0-core/src/events/vault/`, extending the `Log` base class. Export from `events/vault/index.ts` and `events/index.ts`.
- **Fetch functions**: Named `fetch<Property>()`, read raw storage slots via `getStorageAt`, return typed values. Use bit extraction helpers (`extractUint8`, `extractUint16`, etc.) for packed slots.
- **Storage reads over ABI calls**: Prefer direct storage slot reads for efficiency. Only use ABI calls when storage layout is ambiguous or for complex return types.
- **Enums mirror Solidity**: `AccessMode`, `FeeType`, `State` match the contract's `Enums.sol` values exactly.
- **Version bumping**: `bun run bump:patch` (or minor/major) bumps all three packages together.

## Adding New Contract Features to the SDK

When a new feature is added to the Solidity contracts:

1. **v0-core**: Add types/interfaces to `Vault.ts`, constants to `VaultUtils.ts`, storage locations to `EncodingUtils.ts`, new events to `events/vault/`
2. **v0-viem**: Add `fetch<Feature>()` in `fetch/Vault.ts`, wire it into `fetchVault()`, add augmentation if needed
3. **v0-computation**: Update simulation if the feature affects fees or pricing
4. **Barrel exports**: Update all `index.ts` files in the chain
5. **Addresses**: Add deployment addresses to `addresses.ts` when available (use `0x0...0` as placeholder)

## Supported Chains

Ethereum, Arbitrum, Base, Optimism, World Chain, Unichain, Sonic, Berachain, Mantle, Avalanche, TAC, Katana, BSC, Hyperliquid EVM, Linea, Plasma, Sei, Monad. Chain IDs defined in `chain.ts`.
