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
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  bscTestnet,
} from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';

import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const projectId = 'HYF8ezl7Y6MVyFvSMIb6Mdhwbf90DeRq';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [
    alchemyProvider({ apiKey: projectId as string }),
    jsonRpcProvider({
      rpc: chain => ({
        http: `https://bsc-testnet.publicnode.com	`,
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

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
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
