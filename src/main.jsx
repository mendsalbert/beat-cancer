import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";

const root = ReactDOM.createRoot(document.getElementById("root"));

export const thetaTestnet = {
  id: 365,
  name: "Theta ",
  network: "Theta Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Theta Testnet",
    symbol: "TFUEL",
  },
  rpcUrls: {
    default: {
      http: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Theta Explorer",
      url: "https://testnet-explorer.thetatoken.org/",
    },
  },
  testnet: true,
};

root.render(
  <PrivyProvider
    appId="clyg131vo07o513s6lb580wfy"
    config={{
      appearance: {
        theme: "dark",
      },
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
      defaultChain: thetaTestnet,
      supportedChains: [thetaTestnet],
    }}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </PrivyProvider>
);
