export enum ChainId {
  EthMainnet = 1,
  BaseMainnet = 8453,
  PolygonMainnet = 137,
  ArbitrumMainnet = 42161,
  OptimismMainnet = 10,
  WorldChainMainnet = 480,
  FraxtalMainnet = 252,
  ScrollMainnet = 534352,
  InkMainnet = 57073,
  UnichainMainnet = 130,
  SonicMainnet = 146,
  HemiMainnet = 43111,
  ModeMainnet = 34443,
  CornMainnet = 21000000,
  PlumeMainnet = 98866,
  CampMainnet = 123420001114,
  BerachainMainnet = 80094,
  MantleMainnet = 5000,
  AvalancheMainnet = 43114,
}

export interface ChainMetadata {
  readonly name: string;
  readonly id: ChainId;
  readonly explorerUrl: string;
  readonly nativeCurrency: {
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
  };
  readonly identifier: string;
}

export namespace ChainUtils {
  export const toHexChainId = (chainId: ChainId): `0x${string}` => {
    return `0x${chainId.toString(16)}`;
  };

  export const getExplorerUrl = <T extends ChainId>(chainId: T): (typeof ChainUtils.CHAIN_METADATA)[T]['explorerUrl'] => {
    return ChainUtils.CHAIN_METADATA[chainId].explorerUrl;
  };

  export const getExplorerAddressUrl = <T extends ChainId>(chainId: T, address: string): `${(typeof ChainUtils.CHAIN_METADATA)[T]['explorerUrl']}/address/${string}` => {
    return `${getExplorerUrl(chainId)}/address/${address}`;
  };

  export const getExplorerTransactionUrl = <T extends ChainId>(chainId: T, tx: string): `${(typeof ChainUtils.CHAIN_METADATA)[T]['explorerUrl']}/tx/${string}` => {
    return `${getExplorerUrl(chainId)}/tx/${tx}`;
  };

  export const CHAIN_METADATA = {
    [ChainId.EthMainnet]: {
      name: "Ethereum",
      id: ChainId.EthMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://etherscan.io",
      identifier: "mainnet",
    },
    [ChainId.BaseMainnet]: {
      name: "Base",
      id: ChainId.BaseMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://basescan.org",
      identifier: "base",
    },
    [ChainId.PolygonMainnet]: {
      name: "Polygon",
      id: ChainId.PolygonMainnet,
      nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
      explorerUrl: "https://polygonscan.com",
      identifier: "polygon",
    },
    [ChainId.ArbitrumMainnet]: {
      name: "Arbitrum One",
      id: ChainId.ArbitrumMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://arbiscan.io",
      identifier: "arbitrum",
    },
    [ChainId.OptimismMainnet]: {
      name: "OP Mainnet",
      id: ChainId.OptimismMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://optimistic.etherscan.io",
      identifier: "optimism",
    },
    [ChainId.WorldChainMainnet]: {
      name: "World Chain",
      id: ChainId.WorldChainMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://worldscan.org",
      identifier: "worldchain",
    },
    [ChainId.FraxtalMainnet]: {
      name: "Fraxtal",
      id: ChainId.FraxtalMainnet,
      nativeCurrency: { name: "Frax Ether", symbol: "frxETH", decimals: 18 },
      explorerUrl: "https://fraxscan.com",
      identifier: "fraxtal",
    },
    [ChainId.ScrollMainnet]: {
      name: "Scroll",
      id: ChainId.ScrollMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://scrollscan.com",
      identifier: "scroll",
    },
    [ChainId.InkMainnet]: {
      name: "Ink",
      id: ChainId.InkMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://explorer.inkonchain.com",
      identifier: "ink",
    },
    [ChainId.UnichainMainnet]: {
      name: "Unichain",
      id: ChainId.UnichainMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://uniscan.xyz",
      identifier: "unichain",
    },
    [ChainId.SonicMainnet]: {
      name: "Sonic",
      id: ChainId.SonicMainnet,
      nativeCurrency: { name: "Sonic", symbol: "S", decimals: 18 },
      explorerUrl: "https://sonicscan.org",
      identifier: "sonic",
    },
    [ChainId.HemiMainnet]: {
      name: "Hemi",
      id: ChainId.HemiMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://explorer.hemi.xyz",
      identifier: "hemi",
    },
    [ChainId.ModeMainnet]: {
      name: "Mode",
      id: ChainId.ModeMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://modescan.io",
      identifier: "mode",
    },
    [ChainId.CornMainnet]: {
      name: "Corn",
      id: ChainId.CornMainnet,
      nativeCurrency: { name: "Bitcoin", symbol: "BTCN", decimals: 18 },
      explorerUrl: "https://cornscan.io",
      identifier: "corn",
    },
    [ChainId.PlumeMainnet]: {
      name: "Plume",
      id: ChainId.PlumeMainnet,
      nativeCurrency: { name: "Plume", symbol: "PLUME", decimals: 18 },
      explorerUrl: "https://phoenix-explorer.plumenetwork.xyz",
      identifier: "plume",
    },
    [ChainId.CampMainnet]: {
      name: "Camp",
      id: ChainId.CampMainnet,
      nativeCurrency: { name: "Camp", symbol: "CAMP", decimals: 18 },
      explorerUrl: "https://basecamp.cloud.blockscout.com/",
      identifier: "camp",
    },
    [ChainId.BerachainMainnet]: {
      name: "Berachain",
      id: ChainId.BerachainMainnet,
      nativeCurrency: { name: "Bera", symbol: "BERA", decimals: 18 },
      explorerUrl: "https://berascan.com/",
      identifier: "berachain",
    },
    [ChainId.MantleMainnet]: {
      name: "Mantle",
      id: ChainId.MantleMainnet,
      nativeCurrency: { name: "Mantle", symbol: "MNT", decimals: 18 },
      explorerUrl: "https://mantlescan.xyz/",
      identifier: "mantle",
    },
    [ChainId.AvalancheMainnet]: {
      name: "Avalanche",
      id: ChainId.AvalancheMainnet,
      nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
      explorerUrl: "https://snowtrace.io",
      identifier: "avalanche",
    }
  } as const
}
