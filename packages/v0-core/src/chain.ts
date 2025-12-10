export enum ChainId {
  EthMainnet = 1,
  BaseMainnet = 8453,
  PolygonMainnet = 137,
  ArbitrumMainnet = 42161,
  OptimismMainnet = 10,
  WorldChainMainnet = 480,
  UnichainMainnet = 130,
  SonicMainnet = 146,
  BerachainMainnet = 80094,
  MantleMainnet = 5000,
  AvalancheMainnet = 43114,
  TacMainnet = 239,
  KatanaMainnet = 747474,
  BscMainnet = 56,
  HyperEVMMainnet = 999,
  LineaMainnet = 59144,
  PlasmaMainnet = 9745,

  Sei = 1329
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
    },
    [ChainId.TacMainnet]: {
      name: "Tac",
      id: ChainId.TacMainnet,
      nativeCurrency: { name: "Tac", symbol: "TAC", decimals: 18 },
      explorerUrl: "https://explorer.tac.build/",
      identifier: "tac",
    },
    [ChainId.KatanaMainnet]: {
      name: "Katana",
      id: ChainId.KatanaMainnet,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      explorerUrl: "https://katanascan.com/",
      identifier: "katana",
    },
    [ChainId.BscMainnet]: {
      name: "Binance Smart Chain",
      id: ChainId.BscMainnet,
      nativeCurrency: { name: "Binance", symbol: "BNB", decimals: 18 },
      explorerUrl: "https://bscscan.com/",
      identifier: "bsc",
    },
    [ChainId.HyperEVMMainnet]: {
      name: "Hyperliquid EVM",
      id: ChainId.HyperEVMMainnet,
      nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
      explorerUrl: "https://hyperevmscan.io/",
      identifier: "hyperevm",
    },
    [ChainId.LineaMainnet]: {
      name: "Linea Mainnet",
      id: ChainId.LineaMainnet,
      nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
      explorerUrl: "https://lineascan.build",
      identifier: "linea",
    },
    [ChainId.PlasmaMainnet]: {
      name: "Plasma Mainnet Beta",
      id: ChainId.PlasmaMainnet,
      nativeCurrency: { name: 'XPL', symbol: 'XPL', decimals: 18 },
      explorerUrl: "https://plasmascan.to/",
      identifier: "plasma",
    },
    [ChainId.Sei]: {
      name: "Sei",
      id: ChainId.Sei,
      nativeCurrency: { name: "Sei", symbol: "SEI", decimals: 18 },
      explorerUrl: "https://seiscan.io/",
      identifier: "sei",
    }
  } as const
}
