import AddToWhitelist from "@/hooks/entry-functions/add-to-whitelist";
import RemoveFromWhitelist from "@/hooks/entry-functions/remove-from-whitelist";
import MintNFT from "@/hooks/entry-functions/mint-my-nft";
import ViewNFTsByUser from "@/hooks/view-functions/get-nfts-by-user";
// import CheckWhitelist from "@/hooks/view-functions/check-whitelisted";
import ViewAllNFTs from "@/hooks/view-functions/get-all-minted-nfts";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-4 text-4xl font-bold">
        Status: Working in Progress (Integration)
      </h1>

      <div className="mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border-1 border-white p-10 text-lg text-gray-700">
        <p className="text-[#ededed]">Are you whitelisted?</p>
        <p className="text-red-800/80">wip: whitelist auto checker</p>
        <AddToWhitelist />
        <RemoveFromWhitelist />
      </div>

      {/* 
      <div className="mt-10 mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border-1 border-white p-10 text-lg text-gray-700">
        <p className="text-[#ededed]"">Check if user is Whitelisted</p>
        <CheckWhitelist />
      </div> */}

      <div className="mt-10 mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border-1 border-white p-10 text-lg text-gray-700">
        <p className="text-[#ededed]">Mint your NFT now??</p>
        <MintNFT />
      </div>

      <div className="mt-10 mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border-1 border-white p-10 text-lg text-gray-700">
        <p className="text-[#ededed]">View my NFT</p>
        <p className="text-red-800/80">wip: NFT user viewer</p>

        <ViewNFTsByUser />
      </div>

      <div className="mt-10 mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border-1 border-white p-10 text-lg text-gray-700">
        <p className="text-[#ededed]">View ALL NFTs</p>
        <p className="text-red-800/80">wip: shows all minted tokens</p>

        <ViewAllNFTs />
      </div>
    </div>
  );
}
