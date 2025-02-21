import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, bsc, bscTestnet, polygon, avalanche, fantom, base, optimism, } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "77560e246a64e6b8843d098a5e802306";

if (!projectId) throw new Error("Project ID is not defined");

export const networks = [mainnet, arbitrum, base, bsc, bscTestnet, avalanche, fantom, optimism, polygon];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({ projectId, networks });

export const config = wagmiAdapter.wagmiConfig;
