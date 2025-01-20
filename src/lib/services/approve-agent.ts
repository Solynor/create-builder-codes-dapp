import { toHex } from "viem";
import { signTypedData } from "@wagmi/core";
import { Signature } from "ethers";
import { wagmiAdapter } from "@/lib/config/wagmi";
import { isMainnet } from "@/lib/config";
import { Signature as SplitSignature } from "@/lib/types/signature";
import type { SignTypedDataReturnType } from "@wagmi/core";
import axios from "@/lib/config/axios";

type ApproveAgentAction = {
  type: "approveAgent";
  signatureChainId: `0x${string}`;
  hyperliquidChain: "Mainnet" | "Testnet";
  agentAddress: `0x${string}`;
  agentName: string;
  nonce: number;
};

export async function approveAgent({
  chain,
  agentAddress,
  agentName = "test_spot_trader",
}: {
  chain: { id: number };
  agentAddress: `0x${string}`;
  agentName?: string;
}) {
  if (!chain) {
    throw new Error("Missing chain");
  }

  const nonce = Date.now();
  const signatureChainId = toHex(chain?.id || 421614);
  const hyperliquidChain = isMainnet ? "Mainnet" : "Testnet";

  const action: ApproveAgentAction = {
    type: "approveAgent",
    signatureChainId,
    hyperliquidChain,
    agentAddress,
    agentName,
    nonce,
  };

  const data = {
    domain: {
      name: "HyperliquidSignTransaction",
      version: "1",
      chainId: chain?.id || 421614,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: {
      "HyperliquidTransaction:ApproveAgent": [
        { name: "hyperliquidChain", type: "string" },
        { name: "agentAddress", type: "address" },
        { name: "agentName", type: "string" },
        { name: "nonce", type: "uint64" },
      ],
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
    },
    primaryType: "HyperliquidTransaction:ApproveAgent",
    message: action,
  };

  const eip712Signature: SignTypedDataReturnType = await signTypedData(
    wagmiAdapter.wagmiConfig,
    // @ts-expect-error ignore type
    data
  );

  const signature: SplitSignature = Signature.from(eip712Signature);

  const response = await axios.post("/exchange", {
    action: action,
    nonce: nonce,
    signature,
  });

  return response.data;
}
