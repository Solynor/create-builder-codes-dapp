import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function TradeForm({ type }: { type: "buy" | "sell" }) {
  const isBuy = type === "buy";

  const midPriceData = 100;
  const totalAmount = 100;
  const tokenDetails = { szDecimals: 6 };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isBuy ? "Buy $HYPE" : "Sell $HYPE"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="space-y-1">
              <Label htmlFor="Price">Price</Label>
              <Input id="Price" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="Slippage">Slippage</Label>
              <Input id="Slippage" />
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
              40 USDC
            </dd>
          </dl>

          <Separator className="mt-4" />
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button className="w-full">Buy</Button>
      </CardFooter>
    </Card>
  );
}
