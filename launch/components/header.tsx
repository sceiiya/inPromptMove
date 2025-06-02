import WalletSelectorButton from "./wallet-selector";

export default function Header() {
  return (
    <div className="flex w-full justify-between py-4 px-20 items-center bg-slate-700 sticky top-0 z-50">
      <p className="font-bold text-[40px] text-[#d3caca]">Qbit Sceii</p>
      <WalletSelectorButton />
    </div>
  );
}
