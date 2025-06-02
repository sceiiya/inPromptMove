// "use client";
// import React, { useState } from "react";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
// import { MODULE_ADDRESS } from "@/constants";

// const config = new AptosConfig({ network: Network.TESTNET });
// const aptos = new Aptos(config);

// export default function CheckWhitelist() {
//   const [nonce, setNonce] = React.useState<string>("");
//   const { account, submitTransaction } = useWallet();

//   const onSignAndSubmitTransaction = async ({
//     address,
//   }: {
//     address: string;
//   }) => {
//     if (account == null) {
//       throw new Error("Unable to find account to sign transaction");
//     }

//     const payload: InputViewFunctionData = {
//       function: `${MODULE_ADDRESS}::is_whitelisted`,
//       typeArguments: [],  
//       functionArguments: [address],
//     }

//     const output = (await aptos.view({
//       sender: account.address,
//       data: payload,
//     })) as { is_whitelisted: boolean }; 

//     const response = await submitTransaction({
//     sender: account.address,
//       data: {
//         function: `${MODULE_ADDRESS}::is_whitelisted`,
//         functionArguments: [address],
//       },
//     });

//     console.log(response);
//     // if you want to wait for transaction
//     try {
//       let txn = await aptos.waitForTransaction({
//         transactionHash: response.hash,
//       });
//       console.log(txn);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <input
//         type="text"
//         value={nonce}
//         onChange={(e) => setNonce(e.target.value)}
//         placeholder="Enter a user address to check"
//         className="mt-2 rounded border p-2"
//       />

//       <button
//         className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 cursor-pointer"
//         onClick={() => onSignAndSubmitTransaction({ address: nonce })}
//         disabled={!nonce || !nonce.startsWith("0x")}
//       >
//         {" "}
//         Check if Whitelisted
//       </button>
//     </>
//   );
// }
