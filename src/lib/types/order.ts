import { config } from "@/lib/config";
import { Decimal } from "decimal.js";

type Tif = "Alo" | "Ioc" | "Gtc";

type Tpsl = "tp" | "sl";

export type LimitOrderType = {
  tif: Tif;
};

export type TriggerOrderTypeWire = {
  triggerPx: string;
  isMarket: boolean;
  tpsl: Tpsl;
};

export type OrderTypeWire = {
  limit?: LimitOrderType;
  trigger?: TriggerOrderTypeWire;
};

export type OrderWire = {
  a: number;
  b: boolean;
  p: string;
  s: string;
  r: boolean;
  t: OrderTypeWire;
  c?: string;
};

export type TriggerOrderType = {
  triggerPx: number;
  isMarket: boolean;
  tpsl: Tpsl;
};

export type OrderType = {
  limit?: LimitOrderType;
  trigger?: TriggerOrderType;
};

class Cloid {
  private _rawCloid: string;

  constructor(rawCloid: string) {
    this._rawCloid = rawCloid;
    this._validate();
  }

  private _validate(): void {
    if (!this._rawCloid.startsWith("0x")) {
      throw new Error("cloid is not a hex string");
    }
    if (this._rawCloid.slice(2).length !== 32) {
      throw new Error("cloid is not 16 bytes");
    }
  }

  static fromInt(cloid: number): Cloid {
    return new Cloid(`0x${cloid.toString(16).padStart(32, "0")}`);
  }

  static fromStr(cloid: string): Cloid {
    return new Cloid(cloid);
  }

  toRaw(): string {
    return this._rawCloid;
  }
}

export type OrderRequest = {
  coin: string;
  is_buy: boolean;
  sz: number;
  limit_px: number;
  order_type: OrderType;
  reduce_only: boolean;
  cloid?: Cloid | null;
};

export const floatToWire = (x: number): string => {
  const rounded = x.toFixed(8);
  if (Math.abs(parseFloat(rounded) - x) >= 1e-12) {
    throw new Error("floatToWire causes rounding");
  }
  if (rounded === "-0") {
    return "0";
  }
  return new Decimal(rounded).toString();
};

function orderTypeToWire(orderType: OrderType): OrderTypeWire {
  if ("limit" in orderType) {
    return { limit: orderType.limit };
  } else if ("trigger" in orderType && orderType.trigger) {
    return {
      trigger: {
        isMarket: orderType.trigger.isMarket,
        triggerPx: floatToWire(orderType.trigger.triggerPx),
        tpsl: orderType.trigger.tpsl,
      },
    };
  }
  throw new Error("Invalid order type");
}

export const orderRequestToOrderWire = (
  order: OrderRequest,
  asset: number
): OrderWire => {
  const orderWire: OrderWire = {
    a: asset,
    b: order.is_buy,
    p: floatToWire(order.limit_px),
    s: floatToWire(order.sz),
    r: order.reduce_only,
    t: orderTypeToWire(order.order_type),
  };

  if (order.cloid) {
    orderWire.c = order.cloid.toRaw();
  }

  return orderWire;
};

export const orderWiresToOrderAction = (orderWires: OrderWire[]) => {
  return {
    type: "order",
    orders: orderWires,
    grouping: "na" as const,
    builder: {
      b: config.builderAddress.toLowerCase(),
      f: 1,
    },
  };
};
