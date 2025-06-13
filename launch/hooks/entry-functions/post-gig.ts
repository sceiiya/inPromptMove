"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS, MODULE_NAME, NETWORK } from "@/constants";

const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

export default function usePostGig() {
  const { account, signAndSubmitTransaction } = useWallet();

  const postGig = async (title: string, description: string, bounty: number, startTime: number, endTime: number) => {
    if (!account) throw new Error("Wallet not connected");

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::post_gig`,
          functionArguments: [title, description, bounty, startTime, endTime],
        },
      });

      await aptos.waitForTransaction({ transactionHash: response.hash });
      return response.hash;
    } catch (error) {
      console.error("Failed to post gig:", error);
      throw error;
    }
  };

  return { postGig, account };
}