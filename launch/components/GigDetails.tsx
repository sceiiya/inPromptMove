"use client";
import { useState, useEffect } from "react";
import { getGig } from "@/hooks/view-functions/get-gig";
import SubmitWork from "./SubmitWork";
import SelectWinner from "./SelectWinner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface GigDetailsProps {
  posterAddr: string;
  gigId: number;
}

export default function GigDetails({ posterAddr, gigId }: GigDetailsProps) {
  const { account } = useWallet();
  const [gig, setGig] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedGig = await getGig(posterAddr, gigId);
        setGig(fetchedGig);
      } catch (err: any) {
        setError(err.message || "Failed to fetch gig");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [posterAddr, gigId]);

  if (loading) return <p className="text-gray-400">Loading gig...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!gig) return <p className="text-gray-400">Gig not found.</p>;

  const isPoster = account && account.address === gig.poster;
  const isActive = gig.is_active && Date.now() / 1000 <= gig.end_time;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{gig.title}</h1>
      <p className="text-gray-300">{gig.description}</p>
      <p className="text-gray-300">Bounty: {gig.bounty}</p>
      <p className="text-gray-300">
        Start Time: {new Date(gig.start_time * 1000).toLocaleString()}
      </p>
      <p className="text-gray-300">
        End Time: {new Date(gig.end_time * 1000).toLocaleString()}
      </p>
      <p className="text-gray-300">Status: {gig.is_active ? "Active" : "Closed"}</p>
      <p className="text-gray-300">Poster: {gig.poster}</p>

      {isActive && !isPoster && <SubmitWork posterAddr={posterAddr} gigId={gigId} />}

      {isPoster && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Submissions</h2>
          {gig.submissions.length === 0 ? (
            <p className="text-gray-400">No submissions yet.</p>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {gig.submissions.map((submission: any) => (
                <div
                  key={submission.id}
                  className="p-4 border rounded-lg border-white/20 bg-gray-800"
                >
                  <p className="text-gray-300">Submitter: {submission.submitter}</p>
                  <p className="text-gray-300">
                    Work Link: <a href={submission.work_link} className="text-blue-400 underline">{submission.work_link}</a>
                  </p>
                  <p className="text-gray-300">
                    Submitted: {new Date(submission.submission_time * 1000).toLocaleString()}
                  </p>
                  {gig.is_active && Date.now() / 1000 > gig.end_time && (
                    <SelectWinner
                      posterAddr={posterAddr}
                      gigId={gigId}
                      submissionId={submission.id}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}