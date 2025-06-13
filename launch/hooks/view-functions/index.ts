// import { useWallet } from '@aptos-labs/wallet-adapter-react'; 
// import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
// import { MODULE_ADDRESS } from '@/constants';
 
// const config = new AptosConfig({ network: Network.MAINNET });
// const aptos = new Aptos(config);
 
// export const SignAndSubmit = ({account, function_name, function_arguments}: {account:any, function_name: string, function_arguments: any[]}) => {
//   const { signAndSubmitTransaction } = useWallet();
 
//   const onSignAndSubmitTransaction = async () => {
//     if(account == null) {
//         throw new Error("Unable to find account to sign transaction")
//     }
//     const response = await signAndSubmitTransaction({
//       sender: account.address,
//       data: {
//         function: `${MODULE_ADDRESS}::${function_name}`,
//         functionArguments: function_arguments,
//       },
//     });
//     // if you want to wait for transaction
//     try {
//       return await aptos.waitForTransaction({ transactionHash: response.hash });
//     } catch (error) {
//       console.error(error);
//       return error;
//     }
//   };
  
// };