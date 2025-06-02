"use client";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";

//! You can override these classes

// .wallet-selector-modal
// .wallet-selector-icon
// .wallet-selector-text
// .wallet-menu-wrapper
// .wallet-name-wrapper
// .wallet-connect-button
// .wallet-connect-install
// .wallet-button
// .wallet-modal-title
// .aptos-connect-button
// .aptos-connect-privacy-policy-wrapper
// .aptos-connect-privacy-policy-text
// .aptos-connect-privacy-policy-link
// .aptos-connect-powered-by
// .about-aptos-connect-trigger-wrapper
// .about-aptos-connect-trigger
// .about-aptos-connect-header
// .about-aptos-connect-graphic-wrapper
// .about-aptos-connect-text-wrapper
// .about-aptos-connect-title
// .about-aptos-connect-description
// .about-aptos-connect-footer-wrapper
// .about-aptos-connect-screen-indicators-wrapper
// .about-aptos-connect-screen-indicator

export const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <AptosWalletAdapterProvider
      optInWallets={["Petra"]}
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
