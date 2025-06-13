"use client";
import Link from "next/link";
import { Gig } from "@/hooks/view-functions/get-gig";

interface GigListProps {
  gigs: Gig[];
}

export default function GigList({ gigs }: GigListProps) {
  console.log("GigList component rendered with gigs:", gigs);
  // Filter gigs into active and finished
  const activeGigs = gigs.filter((gig) => gig.is_active && Date.now() / 1000 <= gig.end_time);
  const finishedGigs = gigs.filter((gig) => !gig.is_active || Date.now() / 1000 > gig.end_time);

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      {/* Active Gigs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Active Gigs</h2>
        {activeGigs.length === 0 ? (
          <p className="text-gray-400">No active gigs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGigs.map((gig) => (
              <Link key={`${gig.poster}-${gig.gigId}`} href={`/gigs/${gig.gigId}?poster=${gig.poster}`} passHref>
                <div className="p-4 border rounded-lg border-white/20 bg-gray-800 hover:bg-gray-700 cursor-pointer">
                  <h3 className="text-xl font-semibold">{gig.title}</h3>
                  <p className="text-gray-400">{gig.description.slice(0, 100)}...</p>
                  <p className="text-gray-300">Bounty: {gig.bounty}</p>
                  <p className="text-gray-300">Poster: {gig.poster.slice(0, 6)}...{gig.poster.slice(-4)}</p>
                  <p className="text-gray-300">Ends: {new Date(gig.end_time * 1000).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Finished Gigs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Finished Gigs</h2>
        {finishedGigs.length === 0 ? (
          <p className="text-gray-400">No finished gigs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finishedGigs.map((gig) => (
              <Link key={`${gig.poster}-${gig.gigId}`} href={`/gigs/${gig.gigId}?poster=${gig.poster}`} passHref>
                <div className="p-4 border rounded-lg border-white/20 bg-gray-800 hover:bg-gray-700 cursor-pointer">
                  <h3 className="text-xl font-semibold">{gig.title}</h3>
                  <p className="text-gray-400">{gig.description.slice(0, 100)}...</p>
                  <p className="text-gray-300">Bounty: {gig.bounty}</p>
                  <p className="text-gray-300">Poster: {gig.poster.slice(0, 6)}...{gig.poster.slice(-4)}</p>
                  <p className="text-gray-300">Ended: {new Date(gig.end_time * 1000).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 