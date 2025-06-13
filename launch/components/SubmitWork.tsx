"use client";
import { useState } from "react";
import useSubmitWork from "@/hooks/entry-functions/submit-work";

interface SubmitWorkProps {
  posterAddr: string;
  gigId: number;
}

export default function SubmitWork({ posterAddr, gigId }: SubmitWorkProps) {
  const { submitWork, account } = useSubmitWork();
  const [workLink, setWorkLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const txHash = await submitWork(posterAddr, gigId, workLink);
      setSuccess(`Work submitted! Tx: ${txHash}`);
      setWorkLink("");
    } catch (err: any) {
      setError(err.message || "Failed to submit work");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Work Link (e.g., https://example.com/work)"
        value={workLink}
        onChange={(e) => setWorkLink(e.target.value)}
        className="rounded-md border-1 border-white bg-gray-800 p-2 text-white"
        required
      />
      <button
        type="submit"
        className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 text-black disabled:opacity-50"
        disabled={loading || !account}
      >
        {loading ? "Submitting..." : "Submit Work"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </form>
  );
}