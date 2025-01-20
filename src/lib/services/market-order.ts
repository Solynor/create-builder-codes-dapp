import axios from "@/lib/config/axios";
import { privateKeyToAccount } from "viem/accounts";
import { signStandardL1Action } from "@/lib/helpers/signing";
import { config } from "@/lib/config";
import {
  OrderRequest,
  orderWiresToOrderAction,
  orderRequestToOrderWire,
} from "@/lib/types/order";
import { Signature } from "@/lib/types/signature";

type Order = {
  baseToken: string;
  quoteToken: string;
  order: OrderRequest;
};

export async function submitMarketOrder(orderDto: Order, pk: `0x${string}`) {
  try {
    const pairIndex = await requestAssetId(
      orderDto.baseToken,
      orderDto.quoteToken
    );

    if (pairIndex > -1) {
      const nonce = Date.now();
      const account = privateKeyToAccount(pk);

      const calculatedAssetId = 10000 + pairIndex;
      const orderWire = orderRequestToOrderWire(
        orderDto.order,
        calculatedAssetId
      );
      const orderAction = orderWiresToOrderAction([orderWire]);

      const signature: Signature = await signStandardL1Action(
        orderAction,
        account,
        null,
        nonce
      );

      const orderRequest = {
        action: {
          type: "order",
          orders: [
            {
              a: calculatedAssetId,
              b: orderDto.order.is_buy,
              p: orderDto.order.limit_px.toString(),
              s: orderDto.order.sz.toString(),
              r: false,
              t: {
                limit: {
                  tif: "Ioc",
                },
              },
            },
          ],
          grouping: "na",
          builder: {
            b: config.builderAddress.toLowerCase(),
            f: 1,
          },
        },
        nonce: nonce,
        signature: signature,
        vaultAddress: null,
      };

      const result = await axios.post("/exchange", orderRequest);

      if (result.data) {
        return result.data;
      }
    }
    throw new Error("Failed to get valid pair index");
  } catch (e) {
    console.error("Error submitting market order:", e);
    throw e;
  }
}

type SpotMetaResponse = {
  universe: Array<{
    tokens: [number, number];
    name: string;
    index: number;
    isCanonical: boolean;
  }>;
  tokens: Array<{
    name: string;
    szDecimals: number;
    weiDecimals: number;
    index: number;
    tokenId: string;
    isCanonical: boolean;
  }>;
};

async function requestAssetId(
  baseToken: string,
  quoteToken: string
): Promise<number> {
  const response = await axios.post(`/info`, {
    type: "spotMeta",
  });

  if (response.data) {
    const data: SpotMetaResponse = response.data;
    const base = data.tokens.find((token) => token.name == baseToken);
    const quote = data.tokens.find((token) => token.name == quoteToken);

    if (base && quote) {
      const pair = data.universe.find((pair) => {
        const [baseIndex, quoteIndex] = pair.tokens;
        return baseIndex === base.index && quoteIndex === quote.index;
      });

      if (pair) {
        return pair.index;
      }
    }
  }

  return -1;
}

interface ConstructOrderParams {
  amount: string;
  isBuy: boolean;
  slippage: number;
  midPrice: number;
  tokenDecimals: number;
}

export function constructOrder({
  amount,
  isBuy,
  slippage,
  midPrice,
  tokenDecimals,
}: ConstructOrderParams) {
  const priceWithSlippage = calculateSlippagePrice(
    midPrice,
    isBuy,
    slippage,
    true
  );

  console.log({ midPrice, priceWithSlippage });

  // Calculate size based on direction
  let size = isBuy ? parseFloat(amount) / midPrice : parseFloat(amount);

  // Adjust size precision based on token decimals
  size =
    Math.floor(size * Math.pow(10, tokenDecimals)) /
    Math.pow(10, tokenDecimals);

  const orderRequest: OrderRequest = {
    coin: "HYPE",
    is_buy: isBuy,
    sz: size,
    limit_px: parseFloat(priceWithSlippage),
    reduce_only: false,
    order_type: {
      limit: { tif: "Ioc" },
    },
  };

  return {
    baseToken: "HYPE",
    quoteToken: "USDC",
    order: orderRequest,
  };
}

export const calculateSlippagePrice = (
  price: number,
  isBuy: boolean,
  slippage: number,
  isSpot: boolean
): string => {
  // Calculate price with slippage
  const adjustedPrice = price * (isBuy ? 1 + slippage : 1 - slippage);

  // Convert to string with 5 significant figures
  const roundedPrice = Number(adjustedPrice.toPrecision(5));

  // Round to appropriate decimal places (8 for spot, 6 for perps)
  const decimalPlaces = isSpot ? 8 : 6;
  return roundedPrice.toFixed(decimalPlaces);
};
