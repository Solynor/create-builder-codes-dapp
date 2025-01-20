import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeForm from "./TradeForm";
import useUserStore from "@/lib/store";
import ApproveBuilderFee from "./ApproveBuilderFee";
import ApproveAgent from "./ApproveAgent";

export default function Trade() {
  const user = useUserStore((state) => state.user);

  if (!user?.builderFee) {
    return <ApproveBuilderFee />;
  } else if (!user.agent) {
    return <ApproveAgent />;
  } else {
    return (
      <Tabs defaultValue="buy" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>

        <TabsContent value="buy">
          <TradeForm type="buy" />
        </TabsContent>

        <TabsContent value="sell">
          <TradeForm type="sell" />
        </TabsContent>
      </Tabs>
    );
  }
}
