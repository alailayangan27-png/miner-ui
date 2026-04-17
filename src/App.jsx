import { useEffect, useState } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { motion } from "framer-motion";

const API = "https://mining-production-ad0d.up.railway.app";

export default function App() {
  const wallet = useTonWallet();
  const user_id = wallet?.account?.address || "guest";

  const [data, setData] = useState({
    balance: 0,
    energy: 100,
    level: 1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(API + "/sync", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user_id })
      })
      .then(res => res.json())
      .then(setData);
    }, 2000);

    return () => clearInterval(interval);
  }, [user_id]);

  const tap = () => {
    fetch(API + "/tap", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ user_id })
    });
  };

  return (
    <div style={{padding:20,color:"#fff"}}>
      <TonConnectButton />

      <h1>{data.balance.toFixed(2)} TON</h1>

      <motion.div
        onClick={tap}
        whileTap={{ scale: 0.9 }}
        style={{
          width:150,
          height:150,
          borderRadius:"50%",
          background:"gold",
          margin:"20px auto"
        }}
      />

      <p>Energy: {data.energy}</p>
      <p>Level: {data.level}</p>
    </div>
  );
}
