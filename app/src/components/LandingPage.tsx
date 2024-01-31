import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect, useAccount, useBalance } from "wagmi";

export default function LandingPage() {
  const { isConnected, address } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>Landing page here</h1>
      {!isConnected && <p>Please connect your wallet to get started</p>}
      {isConnected && <p>Let's gooo!</p>}
    </div>
  );
}
