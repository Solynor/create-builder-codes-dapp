import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeForm from "./TradeForm";

export default function Trade() {
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
