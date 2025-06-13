"use client";
import { useState } from "react";
import usePostGig from "@/hooks/entry-functions/post-gig";

export default function PostGig() {
  const { postGig, account } = usePostGig();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet");
      return;
    }

    // Validate inputs
    const bountyNum = Number(bounty);
    const durationNum = Number(duration);
    if (bountyNum <= 0) {
      setError("Bounty must be a positive number");
      return;
    }
    if (durationNum <= 0) {
      setError("Duration must be a positive number");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Use current timestamp + 60 seconds to account for network delays
      const now = Math.floor(Date.now() / 1000) + 60;
      const endTime = now + durationNum * 3600; // Duration in hours
      const txHash = await postGig(title, description, bountyNum, now, endTime);
      setSuccess(`Gig posted! Tx: ${txHash}`);
      setTitle("");
      setDescription("");
      setBounty("");
      setDuration("");
    } catch (err: any) {
      // Handle specific error codes
      if (err.message?.includes("E_INVALID_TIME")) {
        setError("Invalid time: Start time must be in the future, and end time must be after start time.");
      } else {
        setError(err.message || "Failed to post gig");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Gig Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border-1 border-white bg-gray-800 p-2 text-white"
        required
      />
      <textarea
        placeholder="Gig Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="rounded-md border-1 border-white bg-gray-800 p-2 text-white"
        required
      />
      <input
        type="number"
        placeholder="Bounty"
        value={bounty}
        onChange={(e) => setBounty(e.target.value)}
        className="rounded-md border-1 border-white bg-gray-800 p-2 text-white"
        required
        min="1"
      />
      <input
        type="number"
        placeholder="Duration (hours)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="rounded-md border-1 border-white bg-gray-800 p-2 text-white"
        required
        min="1"
      />
      <button
        type="submit"
        className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 text-black disabled:opacity-50"
        disabled={loading || !account}
      >
        {loading ? "Posting..." : "Post Gig"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </form>
  );
}