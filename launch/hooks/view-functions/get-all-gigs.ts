import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS, MODULE_NAME, NETWORK } from "@/constants";
import { getGig, Gig } from "./get-gig";
import { getGigCount } from "./get-gig-count";

const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

export async function getAllGigs(): Promise<Gig[]> {
  try {
    // Fetch all GigCreatedEvent events
    const events = await aptos.getModuleEventsByEventType({
      eventType: `${MODULE_ADDRESS}::${MODULE_NAME}::gig_store::gig_created_events`,
    });

    // Log events for debugging
    console.log("GigCreatedEvents:", events);

    // Extract unique poster addresses
    const posterAddresses = [...new Set(events.map((event: any) => event.data.poster))];

    // Log poster addresses
    console.log("Poster Addresses:", posterAddresses);

    // Fetch gigs for each poster
    const allGigs: Gig[] = [];
    for (const posterAddr of posterAddresses) {
      try {
        const count = await getGigCount(posterAddr);
        console.log(`Gig count for ${posterAddr}: ${count}`);
        const gigPromises = Array.from({ length: count }, (_, i) => getGig(posterAddr, i));
        const gigs = await Promise.all(gigPromises);
        // Filter out null gigs and add valid ones
        gigs.forEach((gig) => {
          if (gig) allGigs.push(gig);
        });
      } catch (error) {
        console.error(`Failed to fetch gigs for ${posterAddr}:`, error);
      }
    }

    // Log all fetched gigs
    console.log("All Gigs:", allGigs);

    return allGigs;
  } catch (error) {
    console.error("Failed to fetch all gigs:", error);
    return [];
  }
}