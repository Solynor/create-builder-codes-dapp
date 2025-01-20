import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { generateAgentAccount } from "@/lib/helpers/generateAccount";
import { useMutation } from "@tanstack/react-query";
import { approveAgent } from "@/lib/services/approve-agent";
import { useAccount } from "wagmi";
import useUserStore from "@/lib/store";

const agent = generateAgentAccount();

export default function ApproveAgent() {
  const { chain } = useAccount();
  const updateAgent = useUserStore((state) => state.updateAgent);

  const { mutate: approveAgentMutation, isPending } = useMutation({
    mutationFn: async () => {
      if (!agent.address || !agent.privateKey || !chain) {
        throw new Error("Missing address or chain");
      }

      const result = await approveAgent({ agentAddress: agent.address, chain });

      console.log("result", result);

      if (result?.status !== "ok") {
        throw new Error("Failed to sign builder fee");
      }

      return result;
    },
    onSuccess: (result) => {
      if (result) {
        updateAgent({
          address: agent.address,
          privateKey: agent.privateKey,
        });
      }
    },
    onError: (error) => {
      console.error("signBuilderFee error", error);
    },
  });

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
        <Separator className="mb-4" />

        <div className="mb-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none truncate">
              Agent Address
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {agent.address}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium leading-none">
              Agent Private Key
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {agent.privateKey}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <Button
          className="mt-4"
          onClick={() => approveAgentMutation()}
          disabled={isPending}
        >
          Approve Agent
        </Button>
      </CardContent>
    </Card>
  );
}
