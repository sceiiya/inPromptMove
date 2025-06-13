import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS, MODULE_NAME, NETWORK } from "@/constants";

const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

export interface Submission {
  id: number;
  submitter: string;
  work_link: string;
  submission_time: number;
}

export interface Gig {
  title: string;
  description: string;
  bounty: number;
  start_time: number;
  end_time: number;
  poster: string;
  is_active: boolean;
  submissions: Submission[];
  gigId: number; // Add gigId for tracking
}

export async function getGig(posterAddr: string, gigId: number): Promise<Gig | null> {
  try {
    const [title, description, bounty, start_time, end_time, poster, is_active, submissions] = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_gig`,
        functionArguments: [posterAddr, gigId],
      },
    });

    return {
      title,
      description,
      bounty: Number(bounty),
      start_time: Number(start_time),
      end_time: Number(end_time),
      poster,
      is_active,
      submissions: submissions.map((s: any) => ({
        id: Number(s.id),
        submitter: s.submitter,
        work_link: s.work_link,
        submission_time: Number(s.submission_time),
      })),
      gigId,
    };
  } catch (error: any) {
    if (error.message?.includes("E_NOT_INITIALIZED") || error.message?.includes("ABORTED")) {
      return null; // Account not initialized or gig not found
    }
    console.error(`Failed to get gig ${gigId} for ${posterAddr}:`, error);
    return null;
  }
}