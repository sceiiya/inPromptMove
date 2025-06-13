import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS, MODULE_NAME, NETWORK } from "@/constants";

const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

export async function getGigCount(posterAddr: string): Promise<number> {
  try {
    const [count] = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_gig_count`,
        functionArguments: [posterAddr],
      },
    });
    return Number(count);
  } catch (error: any) {
    if (error.message?.includes("E_NOT_INITIALIZED") || error.message?.includes("ABORTED")) {
      // Account not initialized, return 0 gigs
      return 0;
    }
    console.error("Failed to get gig count:", error);
    throw error;
  }
}