import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

export type Agent = {
  privateKey: `0x${string}`;
  address: `0x${string}`;
};

export const generateAgentAccount = (): Agent => {
  const privateKey = generatePrivateKey();
  const { address } = privateKeyToAccount(privateKey);
  return { privateKey, address };
};
