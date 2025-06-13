// async function getAllGigsViaIndexer(): Promise<Gig[]> {
//   const response = await fetch("https://indexer.testnet.aptoslabs.com/v1/graphql", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       query: `
//         query {
//           events(where: { type: "${MODULE_ADDRESS}::${MODULE_NAME}::GigCreatedEvent" }) {
//             data {
//               poster
//               gig_id
//             }
//           }
//         }
//       `,
//     }),
//   });
//   const { data } = await response.json();
//   const posterAddresses = [...new Set(data.events.map((e: any) => e.data.poster))];
//   // Fetch gigs as in getAllGigs
//   const allGigs: Gig[] = [];
//   for (const posterAddr of posterAddresses) {
//     const count = await getGigCount(posterAddr);
//     const gigs = await Promise.all(Array.from({ length: count }, (_, i) => getGig(posterAddr, i)));
//     gigs.forEach((gig, index) => gig && allGigs.push({ ...gig, gigId: index }));
//   }
//   return allGigs;
// }