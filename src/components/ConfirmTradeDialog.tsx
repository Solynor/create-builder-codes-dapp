import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ConfirmTradeDialog({
  open,
  setOpen,
  handleApprove,
  slippage,
  midPrice,
  estimatedTotal,
  token,
  orderValue,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleApprove: () => void;
  slippage: number;
  fees: string;
  midPrice?: number;
  estimatedTotal: string;
  token: string;
  orderValue: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="mb-10">
          <DialogTitle>You will receive</DialogTitle>
          <DialogDescription>
            {estimatedTotal} {token}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between font-bold">
          <p>
            1 {token} = {midPrice ? `${midPrice} USDC` : "Loading..."}
          </p>
        </div>
        <Separator className="my-3 bg-[#E2E5E8]" />

        <dl className="grid grid-cols-2 gap-y-1">
          <dt className="text-sm font-medium leading-none">Slippage</dt>
          <dd className="text-sm text-muted-foreground text-right">
            Max {slippage}%
          </dd>
          <dt className="text-sm font-medium leading-none">Expected output</dt>
          <dd className="text-sm text-muted-foreground text-right">
            {orderValue}
          </dd>
        </dl>

        <Separator className="mt-4" />

        <div className="mb-10">
          <p className="text-sm text-gray-400">
            Please expect some price slippage due to market movements
          </p>
        </div>

        <DialogFooter className="max-w-80">
          <Button onClick={handleApprove}>Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
