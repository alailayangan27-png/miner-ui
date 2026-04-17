import { useEffect, useState } from "react";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";

const API = "https://mining-production-ad0d.up.railway.app";
const RECEIVER = "UQAPRU6cHYSkS8hIxl-zbcts9yt8_GtYcSh_R0nbYnWL5lFX";

export default function App() {
  const [tonConnectUI] = useTonConnectUI();
  const [total, setTotal] = useState(0);

  const user_id = "user1";

  const load = async () => {
    const res = await fetch(API + "/user", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({user_id})
    });
    const data = await res.json();
    setTotal(data.total);
  };

  useEffect(() => {
    load();
  }, []);

  const mint = async () => {
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Date.now() + 60000,
        messages: [
          {
            address: RECEIVER,
            amount: "100000000"
          }
        ]
      });

      await fetch(API + "/deposit", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          user_id,
          amount: 0.1
        })
      });

      load();

    } catch (e) {
      console.log("cancel");
    }
  };

  return (
    <div style={{
      background:"#0b0f1a",
      height:"100vh",
      color:"#fff",
      textAlign:"center",
      paddingTop:"40px"
    }}>
      
      <TonConnectButton />

      <h1>Total Deposit</h1>
      <h2>{total} TON</h2>

      <button onClick={mint}>
        Mint 0.1 TON
      </button>

    </div>
  );
}
