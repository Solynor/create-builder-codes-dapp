import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrumSepolia } from "@reown/appkit/networks";
import { hypeEvmTestnet } from "./chains";

export const projectId = "02b218a0fae412edcdb5e5bff9441a94";

export const networks = [hypeEvmTestnet, arbitrumSepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
