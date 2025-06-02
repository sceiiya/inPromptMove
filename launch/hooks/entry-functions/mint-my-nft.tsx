// "use client"
// import React, {useState} from 'react';
// import { useWallet } from '@aptos-labs/wallet-adapter-react';
// import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
// import { MODULE_ADDRESS } from '@/constants';
// import Link from 'next/link';

// const config = new AptosConfig({ network: Network.TESTNET });
// const aptos = new Aptos(config);

// export default function MintNFT () {
//   const [txnOk, setTxnOk] = useState(false);
//   const [txnHash, setTxnHash] = useState("");
//   const { account, signAndSubmitTransaction } = useWallet();

//   const onSignAndSubmitTransaction = async () => {
//     if(account == null) {
//         throw new Error("Unable to find account to sign transaction")
//     }
//     const response = await signAndSubmitTransaction({
//       sender: account.address,
//       data: {
//         function: `${MODULE_ADDRESS}::mint_nft`,
//         functionArguments: []
//       },
//     });

//     console.log(response)
//     // if you want to wait for transaction
//     try {
//       let txn = await aptos.waitForTransaction({ transactionHash: response.hash });
//       if(txn)
//         {setTxnOk(true);
//         setTxnHash(response.hash);
//         }
//           console.log(txn)
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//     <button className="text-[35px] font-extrabold py-1 px-3 border-1 border-white rounded-md bg-[#dbc4da]" onClick={onSignAndSubmitTransaction}>
//       Mint my Sceii NFT!
//     </button>

//     {txnOk && (<div>
//       <p>Minted Successfully, see transaction </p>
//       <Link href={`https://explorer.aptoslabs.com/txn/${txnHash}?network=testnet`} target="_blank" rel="noopener noreferrer" />here</Link>
//     </div>)
//     }
//     </>
//   );
// };

"use client";
import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "@/constants";
import Link from "next/link";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export default function MintNFT() {
  const [txnOk, setTxnOk] = useState(false);
  const [txnHash, setTxnHash] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();

  const onSignAndSubmitTransaction = async () => {
    setError(null);
    setTxnOk(false);
    setTxnHash("");
    setLoading(true);

    try {
      if (!account) {
        throw new Error("Wallet not connected.");
      }

      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::mint_nft`,
          functionArguments: [],
        },
      });

      console.log("Submitted txn:", response);

      const txn = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });
      if (txn) {
        setTxnOk(true);
        setTxnHash(response.hash);
      }
    } catch (err: any) {
      console.error("Transaction failed:", err);
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 text-[35px] font-extrabold"
        onClick={onSignAndSubmitTransaction}
        disabled={loading}
      >
        {loading ? "Minting..." : "Mint my Sceii NFT!"}
      </button>

      {txnOk && (
        <div className="mt-4">
          <p>
            ✅ Minted Successfully! View the transaction&nbsp;
            <Link
              href={`https://explorer.aptoslabs.com/txn/${txnHash}?network=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              here
            </Link>
            .
          </p>
        </div>
      )}

      {error && <div className="mt-4 text-red-500">❌ Error: {error}</div>}
    </div>
  );
}
