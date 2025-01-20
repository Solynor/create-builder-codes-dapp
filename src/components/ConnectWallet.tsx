import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConnectWallet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hyperliquid Spot Boilerplate</CardTitle>
        <CardDescription>
          Connect your wallet to start using the app
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* @ts-ignore */}
        <appkit-button />
      </CardContent>
    </Card>
  );
}
