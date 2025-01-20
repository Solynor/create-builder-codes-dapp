"use client";

import { useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { fetchTokenDetails } from "@/lib/services/token-details";
import { fetchMidPrice } from "@/lib/services/mid-price";
import { fetchBalances } from "@/lib/services/balances";
import { constructOrder, submitMarketOrder } from "@/lib/services/market-order";
import useUserStore from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface TradeFormProps {
  type: "buy" | "sell";
}

export default function TradeForm({ type }: TradeFormProps) {
  // Constants
  const isBuy = type === "buy";
  const actionText = isBuy ? "Buy" : "Sell";
  const DEFAULT_SLIPPAGE = 0;

  // Hooks
  const { address } = useAccount();
  const user = useUserStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  // Local State
  const [formState, setFormState] = useState<{
    amount: string;
    slippage: number;
  }>({
    amount: "",
    slippage: DEFAULT_SLIPPAGE,
  });
  const [totalAmount, setTotalAmount] = useState(0);

  // Queries
  const { data: balanceData } = useQuery({
    queryKey: ["balances", address],
    queryFn: () => (address ? fetchBalances(address) : null),
    enabled: !!address,
  });

  const { data: midPriceData = 0 } = useQuery({
    queryKey: ["midPrice", "@1035"],
    queryFn: () => fetchMidPrice("@1035"),
  });

  const { data: tokenDetails } = useQuery({
    queryKey: ["tokenDetails", "0x7317beb7cceed72ef0b346074cc8e7ab"],
    queryFn: () => fetchTokenDetails("0x7317beb7cceed72ef0b346074cc8e7ab"),
  });

  // Mutation
  const { mutate: submitOrder, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!midPriceData || !user?.agent?.privateKey || !tokenDetails) {
        throw new Error("Missing required data");
      }

      const amount = formData.get("amount") as string;
      const slippage =
        parseFloat(formData.get("slippage") as string) / 100 || 0;

      const order = constructOrder({
        amount,
        isBuy,
        slippage,
        midPrice: midPriceData,
        tokenDecimals: tokenDetails.szDecimals,
      });

      return submitMarketOrder(order, user.agent.privateKey);
    },
    onSuccess: async (res) => {
      if (res?.status === "ok") {
        const statuses: { [key: string]: string }[] =
          res?.response?.data?.statuses;

        statuses.forEach(async (status) => {
          if (status?.error) {
            toast({
              title: "Something went wrong",
              description: status.error,
            });
          } else if (status?.filled) {
            toast({
              title: "Success",
              description: "Order submitted successfully",
            });

            // Reset form
            formRef.current?.reset();
            setFormState({ amount: "", slippage: DEFAULT_SLIPPAGE });
            setTotalAmount(0);

            // Revalidate queries
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ["balances", address],
              }),
              queryClient.invalidateQueries({
                queryKey: ["midPrice", "@1035"],
              }),
              queryClient.invalidateQueries({
                queryKey: [
                  "tokenDetails",
                  "0x7317beb7cceed72ef0b346074cc8e7ab",
                ],
              }),
            ]);
          }
        });
      } else {
        console.log("res", res);
        toast({
          title: "Error",
          description: "Failed to submit order",
        });
      }
    },
    onError: (error) => {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order",
      });
    },
  });

  // Derived State
  const userBalances = {
    usdc:
      balanceData?.balances?.find((balance) => balance.coin === "USDC")
        ?.total ?? 0,
    hype:
      balanceData?.balances?.find((balance) => balance.coin === "HYPE")
        ?.total ?? 0,
  };

  // Handlers
  const calculateTotalAmount = (amount: string) => {
    if (!midPriceData || !amount) return 0;
    return isBuy
      ? Math.floor(
          (parseFloat(amount) / midPriceData) *
            Math.pow(10, tokenDetails?.szDecimals || 6)
        ) / Math.pow(10, tokenDetails?.szDecimals || 6)
      : parseFloat(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setFormState((prev) => ({ ...prev, amount }));
    setTotalAmount(calculateTotalAmount(amount));
  };

  const orderValue = midPriceData
    ? `${(totalAmount * midPriceData).toFixed(2)} USDC`
    : "Calculating...";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address || !user?.agent?.privateKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    submitOrder(new FormData(e.currentTarget));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">
          {isBuy ? "Buy $HYPE" : "Sell $HYPE"}
        </CardTitle>
        <CardDescription>
          <dl className="grid grid-cols-2 gap-y-1">
            <dt className="text-sm font-medium leading-none">USDC Balance</dt>
            <dd className="text-sm text-muted-foreground text-right">
              {userBalances.usdc} USDC
            </dd>
            <dt className="text-sm font-medium leading-none">HYPE Balance</dt>
            <dd className="text-sm text-muted-foreground text-right">
              {userBalances.hype} HYPE
            </dd>
          </dl>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="space-y-1">
              <Label htmlFor="amount">
                Amount to {actionText} (in {isBuy ? "USDC" : "HYPE"})
              </Label>
              <Input
                id="amount"
                name="amount"
                onChange={handleAmountChange}
                value={formState.amount}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="slippage">Slippage</Label>
              <Input
                id="slippage"
                name="slippage"
                defaultValue={DEFAULT_SLIPPAGE}
              />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-y-1 mt-6">
            <dt className="text-sm font-medium leading-none">Market Value</dt>
            <dd className="text-sm text-muted-foreground text-right">
              1 HYPE = {midPriceData} USDC
            </dd>

            <dt className="text-sm font-medium leading-none">
              Estimated {isBuy ? "HYPE to buy" : "USDC to receive"}
            </dt>
            <dd className="text-sm text-muted-foreground text-right">
              {isBuy
                ? totalAmount.toFixed(tokenDetails?.szDecimals || 6)
                : (totalAmount * midPriceData).toFixed(2)}
            </dd>

            <dt className="text-sm font-medium leading-none">Order Value</dt>
            <dd className="text-sm text-muted-foreground text-right">
              {orderValue}
            </dd>
          </dl>

          <Separator className="mt-4" />

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Submitting..." : `${actionText} HYPE`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
