"use client";
import { useEffect, useState } from "react";
import { rainbowkitUseMoonConnector } from "@moonup/moon-rainbowkit";
import { AUTH, MOON_SESSION_KEY, Storage } from "@moonup/moon-types";
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, configureChains, createConfig, Chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { foundry, polygonMumbai } from "viem/chains";
import NavBar from "@/components/NavBar";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export default function Wrapper({ children }: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [wagmiConfig, setWagmiConfig] = useState<any | null>(null);
  const [chains, setChains] = useState<any | null>(null);

  // console.log(process.env.NEXT_PROVIDER_URL)
  // console.log(process.env.PROVIDER_URL)

  useEffect(() => {
    setIsMounted(true);

    const pegasus: Chain = {
      id: 1891,
      name: "Pegasus Lightlink",
      network: "Pegasus Lightlink",
      nativeCurrency: { decimals: 18, name: "Ethereum", symbol: "ETH" },
      rpcUrls: {
        default: {
          http: ["https://replicator.pegasus.lightlink.io/rpc/v1"],
        },
        public: {
          http: ["https://replicator.pegasus.lightlink.io/rpc/v1"],
        },
      },

      blockExplorers: {
        default: {
          name: "pegasus lightlink",
          url: "https://pegasus.lightlink.io/",
        },
      },
    };

    const { chains, publicClient } = configureChains(
      [
        pegasus,
        polygonMumbai,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [] : []),
      ],
      [
        publicProvider(),
        jsonRpcProvider({
          rpc: (pegasus) => ({
            http: "https://replicator.pegasus.lightlink.io/rpc/v1",
          }),
        }),
      ],
    );
    setChains(chains);

    const { wallets } = getDefaultWallets({
      appName: "RainbowKit App",
      projectId: "YOUR_PROJECT_ID",
      chains,
    });

    const connectors = connectorsForWallets([
      ...wallets,
      {
        groupName: "Other",
        wallets: [
          rainbowkitUseMoonConnector({
            chains: chains,
            options: {
              chainId: 1,
              MoonSDKConfig: {
                Storage: {
                  key: MOON_SESSION_KEY,
                  type: Storage.SESSION,
                },
                Auth: {
                  AuthType: AUTH.JWT,
                },
              },
            },
          }),
        ],
      },
    ]);

    setWagmiConfig(
      createConfig({
        autoConnect: true,
        connectors,
        publicClient,
      }),
    );
    // setWagmiConfig(wagmiConfig);
  }, []);

  if (!isMounted) {
    return null; // or return a placeholder if you want to show something during loading
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <NavBar />
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
