"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS, MODULE_NAME, NETWORK } from "@/constants";

const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

export default function useSubmitWork() {
  const { account, signAndSubmitTransaction } = useWallet();

  const submitWork = async (posterAddr: string, gigId: number, workLink: string) => {
    if (!account) throw new Error("Wallet not connected");

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::submit_work`,
          functionArguments: [posterAddr, gigId, workLink],
        },
      });

      await aptos.waitForTransaction({ transactionHash: response.hash });
      return response.hash;
    } catch (error) {
      console.error("Failed to submit work:", error);
      throw error;
    }
  };

  return { submitWork, account };
}