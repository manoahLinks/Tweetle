import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

import { ArgentTMA, SessionAccountInterface } from "@argent/tma-wallet";
import { useEffect, useState } from "react";

const argentTMA = ArgentTMA.init({
    environment: "sepolia", // "sepolia" | "mainnet" (not supperted yet)
    appName: "token_wordle", // Your Telegram app name
    appTelegramUrl: "https://t.me/Wordle_bot/Token_wordle", // Your Telegram app URL
    sessionParams: {
      allowedMethods: [
        // List of contracts/methods allowed to be called by the session key
        {
          contract:
            "0x03891b46cdd780984a4954a3d54d00051ee761e068b56274c0762dfe80d7d4d9",
          selector: "claimPoints",
        }
      ],
      validityDays: 90 // session validity (in days) - default: 90
    },
  });
  

const MainLayout = () => {

    const [account, setAccount] = useState<SessionAccountInterface | undefined>();
    const [isConnected, setIsConnected] = useState<boolean>(false);


    useEffect(() => {

        argentTMA
        .connect()
        .then((res) => {
            if (!res) {
            // Not connected
            setIsConnected(false);
            return;
            }

            // Connected
            const { account, callbackData } = res;

            if (account.getSessionStatus() !== "VALID") {
            
            const { account } = res;

            setAccount(account);
            setIsConnected(false);
            return;
            }

            // Connected
            // const { account, callbackData } = res;
            // The session account is returned and can be used to submit transactions
            setAccount(account);
            setIsConnected(true);
            // Custom data passed to the requestConnection() method is available here
            console.log("callback data:", callbackData);
        })
        .catch((err) => {
            console.error("Failed to connect", err);
        });
    }, [account]);

    const handleConnectButton = async () => {
        await argentTMA.requestConnection("custom_callback_data");
    };

    // useful for debugging
    const handleClearSessionButton = async () => {
        await argentTMA.clearSession();
        setAccount(undefined);
    };

    return (
        <div className="flex flex-col min-h-screen text-white">
            <main className="flex-grow pb-16">
                <Outlet context={{account, handleClearSessionButton, handleConnectButton, isConnected}} />
            </main>
            <BottomNav />
        </div>
    );
};

export default MainLayout;
