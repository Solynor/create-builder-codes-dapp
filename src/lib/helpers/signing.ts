import { encode } from "@msgpack/msgpack";
import { PrivateKeyAccount } from "viem/accounts";
import { Hex, keccak256 } from "viem";
import { Signature as SplitSignature } from "ethers";

import { isMainnet } from "@/lib/config";

import { Signature } from "@/lib/types/signature";
import { AGENT } from "@/lib/types/typed-data";

export const signStandardL1Action = async (
  action: unknown,
  wallet: PrivateKeyAccount,
  vaultAddress: string | null,
  nonce: number
): Promise<Signature> => {
  console.log("signStandardL1Action", action, vaultAddress, nonce);
  const phantomAgent = {
    source: isMainnet ? "a" : "b",
    connectionId: hashAction(action, vaultAddress, nonce),
  };
  const payloadToSign = {
    domain: {
      name: "Exchange",
      version: "1",
      chainId: 1337,
      verifyingContract: "0x0000000000000000000000000000000000000000" as const,
    },
    types: {
      Agent: [
        { name: "source", type: "string" },
        { name: "connectionId", type: "bytes32" },
      ],
    },
    primaryType: AGENT,
    message: phantomAgent,
  } as const;

  const signedAgent = await wallet.signTypedData(payloadToSign);

  // const signature = SplitSignature.from(signedAgent)
  // const signatureHex =
  //   signature.r + signature.s.slice(2) + signature.v.toString(16)
  //
  // const recoveredAddress = await recoverTypedDataAddress({
  //   domain: phantomDomain,
  //   types: orderTypedData,
  //   primaryType: AGENT,
  //   message: phantomAgent,
  //   signature: signatureHex as `0x${string}`,
  // })
  // console.log('recoveredAddress', recoveredAddress)

  return SplitSignature.from(signedAgent);
};

export const hashAction = (
  action: unknown,
  vaultAddress: string | null,
  nonce: number
): Hex => {
  const msgPackBytes = encode(action);
  const additionalBytesLength = vaultAddress === null ? 9 : 29;
  const data = new Uint8Array(msgPackBytes.length + additionalBytesLength);
  data.set(msgPackBytes);
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  view.setBigUint64(msgPackBytes.length, BigInt(nonce));
  if (vaultAddress === null) {
    view.setUint8(msgPackBytes.length + 8, 0);
  } else {
    view.setUint8(msgPackBytes.length + 8, 1);
    data.set(addressToBytes(vaultAddress), msgPackBytes.length + 9);
  }
  return keccak256(data);
};

export const addressToBytes = (address: string): Uint8Array => {
  const hex = address.startsWith("0x") ? address.substring(2) : address;
  return Uint8Array.from(Buffer.from(hex, "hex"));
};

export const splitSig = (sig: string): Signature => {
  sig = sig.slice(2);
  if (sig.length !== 130) {
    throw new Error(`bad sig length: ${sig.length}`);
  }
  const vv = sig.slice(-2);

  // Ledger returns 0/1 instead of 27/28, so we accept both
  if (vv !== "1c" && vv !== "1b" && vv !== "00" && vv !== "01") {
    throw new Error(`bad sig v ${vv}`);
  }
  const v = vv === "1b" || vv === "00" ? 27 : 28;
  const r = "0x" + sig.slice(0, 64);
  const s = "0x" + sig.slice(64, 128);
  return { r, s, v };
};
