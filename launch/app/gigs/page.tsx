"use client";
import GigList from "@/components/GigList";
import { useState, useEffect } from "react";
import { getAllGigs } from "@/hooks/view-functions/get-all-gigs";
import { Gig } from "@/hooks/view-functions/get-gig";

export default function Gigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const allGigs = await getAllGigs();
        setGigs(allGigs);
      } catch (err: any) {
        setError(err.message || "Failed to fetch gigs");
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <h1 className="mb-4 text-3xl font-bold">All Gigs</h1>
      {loading && <p className="text-gray-400">Loading gigs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <GigList gigs={gigs} />}
    </div>
  );
}