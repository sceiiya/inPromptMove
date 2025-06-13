"use client";
import { useState } from "react";
import useSelectWinner from "@/hooks/entry-functions/select-winner";

interface SelectWinnerProps {
  posterAddr: string;
  gigId: number;
  submissionId: number;
}

export default function SelectWinner({ posterAddr, gigId, submissionId }: SelectWinnerProps) {
  const { selectWinner, account } = useSelectWinner();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSelect = async () => {
    if (!account) {
      setError("Please connect your wallet");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const txHash = await selectWinner(posterAddr, gigId, submissionId);
      setSuccess(`Winner selected! Tx: ${txHash}`);
    } catch (err: any) {
      setError(err.message || "Failed to select winner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 text-black disabled:opacity-50"
        onClick={handleSelect}
        disabled={loading || !account}
      >
        {loading ? "Selecting..." : "Select as Winner"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}