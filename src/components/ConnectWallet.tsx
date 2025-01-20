"use client";

import { useAppKit } from "@reown/appkit/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConnectWallet() {
  const { open } = useAppKit();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hyperliquid Spot Boilerplate</CardTitle>
        <CardDescription>
          Connect your wallet to start using the app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => open()}>Connect Wallet</Button>
      </CardContent>
    </Card>
  );
}
