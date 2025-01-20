import { toHex } from "viem";
import { signTypedData } from "@wagmi/core";
import { Signature } from "ethers";
import { wagmiAdapter } from "@/lib/config/wagmi";
import { config, isMainnet, builderPointsToPercent } from "@/lib/config";
import { Signature as SplitSignature } from "@/lib/types/signature";
import {
  approveBuilderFeeTypedData,
  APPROVE_BUILDER_FEE as PRIMARY_TYPE,
} from "@/lib/types/typed-data";
import type { SignTypedDataReturnType } from "@wagmi/core";
import axios from "@/lib/config/axios";

/** Chain options for Hyperliquid */
export type HyperliquidChain = "Mainnet" | "Testnet";

/** Type definition for approve builder fee action */
export type ApproveBuilderFeeAction = {
  /** Maximum fee rate as percentage string (e.g. '0.01%') */
  maxFeeRate: string;
  /** Builder's address in hex format */
  builder: `0x${string}`;
  /** Timestamp in milliseconds */
  nonce: number;
  /** Action type identifier */
  type: "approveBuilderFee";
  /** Chain ID in hex format (e.g. '0x66eee' for Arbitrum Sepolia) */
  signatureChainId: `0x${string}`;
  /** Target Hyperliquid chain */
  hyperliquidChain: HyperliquidChain;
};

export async function approveBuilder({
  chain,
}: {
  address: string;
  chain: { id: number };
}) {
  if (!chain) {
    throw new Error("Missing chain");
  }

  const nonce = Date.now();
  const builder = config.builderAddress;
  const signatureChainId = toHex(chain?.id || 421614);
  const hyperliquidChain = isMainnet ? "Mainnet" : "Testnet";
  const maxFeeRate = builderPointsToPercent(config.builderFeePercent);

  const action: ApproveBuilderFeeAction = {
    type: "approveBuilderFee",
    nonce,
    maxFeeRate,
    builder,
    signatureChainId,
    hyperliquidChain,
  };

  const data = {
    domain: {
      name: "HyperliquidSignTransaction",
      version: "1",
      chainId: chain?.id || 421614,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: approveBuilderFeeTypedData,
    primaryType: PRIMARY_TYPE,
    message: action,
  };

  const eip712Signature: SignTypedDataReturnType = await signTypedData(
    wagmiAdapter.wagmiConfig,
    // @ts-expect-error ignore lint
    data
  );

  const signature: SplitSignature = Signature.from(eip712Signature);

  const approveBuilderResult = await axios.post("/exchange", {
    action: action,
    nonce: nonce,
    signature,
  });

  return approveBuilderResult.data;
}
