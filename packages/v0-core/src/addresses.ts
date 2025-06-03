import { ChainId } from "./chain";
import { Version } from "./vault/Vault";

export const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export type ChainAddresses = typeof addresses;

export const addresses = {
  [ChainId.EthMainnet]: {
    beaconProxyFactory: "0x09C8803f7Dc251f9FaAE5f56E3B91f8A6d0b70ee",
    feeRegistry: "0x6dA4D1859bA1d02D095D2246142CdAd52233e27C",
    [Version.v0_5_0]: "0xe50554ec802375c9c3f9c087a8a7bb8c26d3dedf",
    wrappedNative: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  },
  [ChainId.ArbitrumMainnet]: {
    beaconProxyFactory: "0x58a7729125acA9e5E9C687018E66bfDd5b2D4490",
    feeRegistry: "0x6dA4D1859bA1d02D095D2246142CdAd52233e27C",
    [Version.v0_5_0]: "0xE50554ec802375C9c3F9c087a8a7bb8C26d3DEDf",
    wrappedNative: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1 ",
    /**
    * @dev Events not indexed
    */
    dev: {
      beaconProxyFactory: "0x29f3dba953C57814A5579e08462724B9C760333e",
      feeRegistry: "0x45BA44B8899D39abdc383a25bB17fcD18240c6Bc",
    }
  },
  [ChainId.BaseMainnet]: {
    beaconProxyFactory: "0xC953Fd298FdfA8Ed0D38ee73772D3e21Bf19c61b",
    feeRegistry: "0x6dA4D1859bA1d02D095D2246142CdAd52233e27C",
    [Version.v0_5_0]: "0xE50554ec802375C9c3F9c087a8a7bb8C26d3DEDf",
    wrappedNative: "0x4200000000000000000000000000000000000006"
  },
  [ChainId.UnichainMainnet]: {
    beaconProxyFactory: "0xaba1A2e157Dae248f8630cA550bd826725Ff745c",
    feeRegistry: "0x652716FaD571f04D26a3c8fFd9E593F17123Ab20",
    [Version.v0_5_0]: "0xE50554ec802375C9c3F9c087a8a7bb8C26d3DEDf",
    wrappedNative: "0x4200000000000000000000000000000000000006"
  },
  [ChainId.BerachainMainnet]: {
    beaconProxyFactory: "0x7cf8cf276450bd568187fdc0b0959d30ec599853",
    feeRegistry: "0xaba1A2e157Dae248f8630cA550bd826725Ff745c",
    [Version.v0_5_0]: "0xE50554ec802375C9c3F9c087a8a7bb8C26d3DEDf",
    wrappedNative: "0x6969696969696969696969696969696969696969"
  },
  [ChainId.SonicMainnet]: {
    beaconProxyFactory: "0x99CD0b8b32B15922f0754Fddc21323b5278c5261",
    feeRegistry: "0xab4aC28D10a4Bc279aD073B1D74Bfa0E385C010C",
    [Version.v0_5_0]: "0xE50554ec802375C9c3F9c087a8a7bb8C26d3DEDf",
    wrappedNative: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38"
  },
  [ChainId.MantleMainnet]: {
    beaconProxyFactory: "0x57D969B556C6AebB3Ac8f54c98CF3a3f921d5659",
    feeRegistry: "0x47A144e67834408716cB40Fa87fc886D63362ddC",
    [Version.v0_4_0]: "0xA7260Cee56B679eC05a736A7b603b8DA8525Dd69",
    wrappedNative: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8"
  },
  [ChainId.WorldChainMainnet]: {
    beaconProxyFactory: "0x600fA26581771F56221FC9847A834B3E5fd34AF7",
    feeRegistry: "0x68e793658def657551fd4D3cA6Bc04b4E7723655",
    [Version.v0_5_0]: "0x1D42DbDde553F4099691A25F712bbd8f2686E355 ",
    wrappedNative: "0x4200000000000000000000000000000000000006"
  },
  [ChainId.AvalancheMainnet]: {
    beaconProxyFactory: "0x5e231c6d030a5c0f51fa7d0f891d3f50a928c685",
    feeRegistry: "0xD7F69ba99c6981Eab5579Aa16871Ae94c509d578",
    [Version.v0_5_0]: "0x33F65C8D025b5418C7f8dd248C2Ec1d31881D465",
    wrappedNative: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
  }
} as const
