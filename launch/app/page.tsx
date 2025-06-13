import InitializeAccount from "@/components/InitializeAccount";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-4 text-4xl font-bold">inPromptMove</h1>
      <p className="mb-8 text-lg text-gray-400">A decentralized gig platform on Aptos</p>
      <div className="flex flex-col items-center gap-4">
        <InitializeAccount />
      </div>
    </div>
  );
}