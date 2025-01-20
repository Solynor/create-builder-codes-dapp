"use client";

import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import Trade from "@/components/Trade";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="flex container mx-auto items-center justify-center p-6 md:p-10">
      {!isConnected ? <ConnectWallet /> : <Trade />}
    </div>
  );
}
