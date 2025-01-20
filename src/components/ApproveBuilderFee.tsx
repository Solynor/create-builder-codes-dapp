"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { approveBuilder } from "@/lib/services/approve-builder";
import { fetchBuilderInfo } from "@/lib/services/builder-info";
import { useAccount } from "wagmi";
import useUserStore from "@/lib/store";
import { useMutation } from "@tanstack/react-query";

export default function ApproveBuilderFee() {
  const { address, chain } = useAccount();
  const updateBuilderFee = useUserStore((state) => state.updateBuilderFee);

  const { mutate: approveBuilderFee, isPending } = useMutation({
    mutationFn: async () => {
      if (!address || !chain) {
        throw new Error("Missing address or chain");
      }

      const result = await approveBuilder({ address, chain });

      if (result?.status !== "ok") {
        throw new Error("Failed to sign builder fee");
      }

      const builderFee = await fetchBuilderInfo(address);
      return builderFee;
    },
    onSuccess: (builderFee) => {
      if (builderFee) {
        updateBuilderFee(builderFee);
      }
    },
    onError: (error) => {
      console.error("signBuilderFee error", error);
    },
  });

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Approve Builder Fee</CardTitle>
        <CardDescription>
          This exchange will take a 0.05% fee for every transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => approveBuilderFee()} disabled={isPending}>
          {isPending ? "Approving..." : "Approve Builder Fee"}
        </Button>
      </CardContent>
    </Card>
  );
}
