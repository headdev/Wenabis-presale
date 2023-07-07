'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  configureChains,
  createConfig,
  WagmiConfig,
  createClient,
} from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  bsc,
  bscTestnet,
  avalancheFuji,
} from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const projectId = 'HYF8ezl7Y6MVyFvSMIb6Mdhwbf90DeRq';

const {
  provider,
  chains,
  publicClient,
  webSocketProvider,
  webSocketPublicClient,
} = configureChains(
  [ bscTestnet , avalancheFuji, bsc],
  [
    alchemyProvider({ apiKey: projectId }),
    jsonRpcProvider({
      rpc: chain => ({
        http: `https://bsc-dataseed.binance.org/`,
      }),
    }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'RaiX Web3',
  projectId,
  chains,
});

const dAppInfo = {
  appName: 'RaiX Web3',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

/* const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  // added connectors from rainbowkit
  connectors,
}); */

const wagmiConfig = createConfig({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={dAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
