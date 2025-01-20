import Trade from "./Trade";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EnableTrading() {
  const user = {
    isBuilderFeeApproved: false,
    isAgentApproved: false,
    isTradingEnabled: true,
  };

  return (
    <div>
      {!user.isBuilderFeeApproved ? (
        <ApproveBuilderFee />
      ) : !user.isAgentApproved ? (
        <ApproveAgent />
      ) : (
        <Trade />
      )}
    </div>
  );
}

function ApproveBuilderFee() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Approve Builder Fee</CardTitle>
        <CardDescription>
          This exchange will take a 0.05% fee for every transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Approve Builder Fee</Button>
      </CardContent>
    </Card>
  );
}

function ApproveAgent() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Establish Connection with Agent</CardTitle>
        <CardDescription>
          This signature is gas-free to send. It opens a decentralized channel
          for gas-free and instantaneous trading.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Agent Address</p>
            <p className="text-sm text-muted-foreground">
              0xb447D84Cce9e6F1818DaCA35A293cfA435Dc75cA
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium leading-none">Agent Address</p>
            <p className="text-sm text-muted-foreground">
              0xb447D84Cce9e6F1818DaCA35A293cfA435Dc75cA
            </p>
          </div>
        </div>

        <Button className="mt-4">Approve Agent</Button>
      </CardContent>
    </Card>
  );
}
