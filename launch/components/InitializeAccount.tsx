"use client";
import { useState } from "react";
import useInitializeAccount from "@/hooks/entry-functions/initialize-account";

export default function InitializeAccount() {
  const { initializeAccount, account } = useInitializeAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInitialize = async () => {
    if (!account) {
      setError("Please connect your wallet");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const txHash = await initializeAccount();
      setSuccess(`Account initialized! Tx: ${txHash}`);
    } catch (err: any) {
      setError(err.message || "Failed to initialize account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="cursor-pointer rounded-md border-1 border-white bg-[#dbc4da] px-3 py-1 text-black disabled:opacity-50"
        onClick={handleInitialize}
        disabled={loading || !account}
      >
        {loading ? "Initializing..." : "New Mover? Initialize Account"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}