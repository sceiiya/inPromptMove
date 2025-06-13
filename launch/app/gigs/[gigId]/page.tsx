"use client";
import GigDetails from "@/components/GigDetails";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function GigPage({ params }: { params: Promise<{ gigId: string }> }) {
  const resolvedParams = use(params); // Unwrap params Promise
  const gigId = Number(resolvedParams.gigId);
  const searchParams = useSearchParams();
  const posterAddr = searchParams.get("poster");

  // Log for debugging
  console.log("GigPage Params:", { gigId, posterAddr });

  if (!posterAddr) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="mb-4 text-3xl font-bold">Gig Details</h1>
        <p className="mb-4 text-gray-400">Invalid gig: Poster address not provided.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <GigDetails posterAddr={posterAddr} gigId={gigId} />
    </div>
  );
}