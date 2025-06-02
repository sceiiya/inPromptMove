"use client";
import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "@/constants";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export default function ViewNFTsByUser() {
  const [nonce, setNonce] = useState<string>("");

  const { account, signAndSubmitTransaction } = useWallet();

  const onSignAndSubmitTransaction = async ({
    address,
  }: {
    address: string;
  }) => {
    if (account == null) {
      throw new Error("Unable to find account to sign transaction");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${MODULE_ADDRESS}::get_nfts_by_address`,
        functionArguments: [address],
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
    <>
      <input
        type="text"
        value={nonce}
        onChange={(e) => setNonce(e.target.value)}
        placeholder="Enter a user address to check"
        className="mt-2 rounded border p-2 text-[#ededed] placeholder:text-[#ededed]"
      />

      <button
        className="rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 cursor-pointer"
        onClick={() => onSignAndSubmitTransaction({ address: nonce })}
        disabled={!nonce || !nonce.startsWith("0x")}
      >
        Inspect User NFTs
      </button>
    </>
  );
}
