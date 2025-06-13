import Link from "next/link";
import WalletSelectorButton from "./wallet-selector";
// import { MODULE_ADDRESS } from "@/constants";

export default function Header() {

//     const url = `https://api.testnet.aptoslabs.com/v1/accounts/${MODULE_ADDRESS}/events/gig_created_events`;
//   // const url = `https://api.devnet.aptoslabs.com/v1/accounts/${MODULE_ADDRESS}/events/{event_handle}/{field_name}`;
// const options = {method: 'GET', headers: {Accept: 'application/json, application/x-bcs'}};

// try {
//   const response = await fetch(url, options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }

  return (
    <div className="flex w-full justify-between py-4 px-20 items-center bg-slate-700 sticky top-0 z-50">
      <p className="font-bold text-[30px] text-[#d3caca]">inPromtMove</p>
      <div>
        <Link className="bg-gray-50/20 p-2 rounded-sm m-1" href="/">Home</Link>
        <Link className="bg-gray-50/20 p-2 rounded-sm m-1" href="/create-gig">Post Gig</Link>
        <Link className="bg-gray-50/20 p-2 rounded-sm m-1" href="/gigs">View Gigs</Link>
      </div>
      <WalletSelectorButton />
    </div>
  );
}
