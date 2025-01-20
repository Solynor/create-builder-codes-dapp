import { defineChain } from "viem";

export const hypeEvmTestnet = /*#__PURE__*/ defineChain({
  id: 998,
  name: "Hype EVM Testnet",
  nativeCurrency: { name: "Hype", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://api.hyperliquid-testnet.xyz/evm"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://hyperevm-explorer.vercel.app",
      apiUrl: "https://api.hyperliquid-testnet.xyz",
    },
  },
  // contracts: {
  //   ensRegistry: {
  //     address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  //   },
  //   ensUniversalResolver: {
  //     address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
  //     blockCreated: 19_258_213,
  //   },
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 14_353_601,
  //   },
  // },
});
