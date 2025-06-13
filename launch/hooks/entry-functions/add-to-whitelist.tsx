"use client";
import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "@/constants";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export default function AddToWhitelist() {
  const { account, signAndSubmitTransaction } = useWallet();

  const onSignAndSubmitTransaction = async () => {
    if (account == null) {
      throw new Error("Unable to find account to sign transaction");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${MODULE_ADDRESS}::sceii_nft::add_self_to_whitelist`,
        functionArguments: [],
      },
    });

    console.log(response);
    // if you want to wait for transaction
    try {
      let txn = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });
      console.log(txn);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1"
      onClick={onSignAndSubmitTransaction}
    >
      Whitelist Me!
    </button>
  );
}
