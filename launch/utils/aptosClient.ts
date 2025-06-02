import { APTOS_API_KEY } from "@/constants";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { Network } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET, clientConfig: { API_KEY: APTOS_API_KEY } }));
// const aptos = new Aptos(new AptosConfig({ network: NETWORK, clientConfig: { API_KEY: APTOS_API_KEY } }));

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}
